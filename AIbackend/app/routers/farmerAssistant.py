from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
import base64
import requests
import io
from PIL import Image
import logging
import os
from dotenv import load_dotenv
import time

router = APIRouter(prefix="/farmer-assistant", tags=["farmer-assistant"])

# Load environment variables if .env file exists
try:
    load_dotenv()
except Exception as e:
    logging.warning(f"Could not load .env file: {e}")

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    logging.warning("GEMINI_API_KEY is not set. Please set your Gemini API key in environment variables.")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create a session for better connection management
session = requests.Session()
session.headers.update({
    "Content-Type": "application/json"
})

# Agricultural keywords to validate responses
AGRICULTURAL_KEYWORDS = [
    "crop", "farm", "soil", "irrigation", "fertilizer", "pest", "disease",
    "harvest", "planting", "weather", "agriculture", "farmer", "yield",
    "seeds", "organic", "sustainable", "agricultural", "farming", "cultivation"
]

def clean_farmer_response(text: str) -> str:
    """Clean and format the farmer assistant response"""
    replacements = {
        "I'm sorry": "Please note",
        "I cannot": "This image doesn't clearly show",
        "I'm not a farmer": "As a farming assistant",
        "you should consult": "it's recommended to consult"
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text

def is_agricultural_response(text: str) -> bool:
    """Validate if the response contains agricultural content"""
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in AGRICULTURAL_KEYWORDS)

def prepare_messages(text_input: Optional[str], encoded_image: Optional[str], supports_vision: bool):
    """Prepare the messages payload based on model capabilities"""
    if supports_vision and encoded_image:
        farmer_prompt = (
            "You are a professional agricultural assistant. Analyze this agricultural image and provide:\n"
            "1. Crop Analysis: Identify crops, growth stage, health status\n"
            "2. Soil Assessment: Comment on soil condition, moisture, texture\n"
            "3. Pest/Disease Identification: Identify any visible pests, diseases, or damage\n"
            "4. Recommendations: Provide specific farming advice and solutions\n"
            "5. Best Practices: Suggest agricultural best practices\n\n"
            "Focus ONLY on agricultural aspects. Use professional farming terminology.\n"
            "The response should be as short as possible"
        )
        
        # For vision models, use a simpler format
        if text_input:
            user_text = f"FARMER QUERY: {text_input}\n\n{farmer_prompt}"
        else:
            user_text = farmer_prompt
            
        return [{
            "role": "user",
            "content": [
                {"type": "text", "text": user_text},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{encoded_image}"}}
            ]
        }]
        
    else:
        # For text-only models
        system_msg = {
            "role": "system",
            "content": (
                "You are a professional agricultural assistant with expertise in:\n"
                "- Crop management and cultivation\n"
                "- Soil health and fertility\n"
                "- Pest and disease management\n"
                "- Irrigation and water management\n"
                "- Organic and sustainable farming\n"
                "- Agricultural best practices\n"
                "- Weather impact on farming\n"
                "- Harvest and post-harvest management\n"
                "- Agricultural technology and innovations\n"
                "- Sustainable farming practices\n\n"
                "Provide practical, actionable advice for farmers. Use clear, professional agricultural language. "
                "Include specific recommendations and best practices relevant to the query."
            )
        }
        content = text_input if text_input else (
            "Please provide a farming-related question or describe an agricultural issue you need help with."
        )
        return [system_msg, {"role": "user", "content": content}]

@router.post("/analyze")
async def farmer_assistant_analysis(
    image: Optional[UploadFile] = File(None),
    query: Optional[str] = Form(None)
):
    """
    Analyze agricultural images and answer farming queries.
    
    - **image**: Upload an agricultural image (crops, soil, pests, etc.)
    - **query**: Ask a farming-related question
    - **Both**: Provide both image and text for comprehensive analysis
    """
    try:
        # Validate at least one input is provided
        if image is None and query is None:
            raise HTTPException(
                status_code=400,
                detail="Either image or text query must be provided"
            )

        # Process text input
        text_input = query.strip() if query else None

        # Process image if provided
        encoded_image = None
        if image:
            try:
                image_content = await image.read()
                if not image_content:
                    raise HTTPException(status_code=400, detail="Empty image file")
                
                # Verify it's a valid image
                img = Image.open(io.BytesIO(image_content))
                img.verify()
                
                # Encode image
                encoded_image = base64.b64encode(image_content).decode("utf-8")
                logger.info("Agricultural image successfully processed and encoded")
            except Exception as e:
                logger.error(f"Invalid image format: {str(e)}")
                raise HTTPException(
                    status_code=400, 
                    detail=f"Invalid image format: {str(e)}"
                )

        # Define models and their capabilities
        models = [
            ("llama-3.3-70b", "llama-3.3-70b-versatile", False),  # Text-only model
            ("llama-vision", "llama-3.2-11b-vision-preview", True),  # Vision-capable model
        ]

        responses = {}
        for model_name, model, supports_vision in models:
            try:
                # Skip if no text and model doesn't support images
                if not text_input and not supports_vision and not encoded_image:
                    responses[model_name] = "Please provide either text query or agricultural image"
                    continue

                messages = prepare_messages(text_input, encoded_image, supports_vision)

                # Special handling for text-only models with image input
                if not supports_vision and encoded_image:
                    if not text_input:
                        responses[model_name] = "This model requires text input (doesn't support images)"
                        continue
                    # For text models with both inputs, we'll just use the text
                    messages = prepare_messages(text_input, None, False)

                # Check if API key is available
                if not GEMINI_API_KEY:
                    responses[model_name] = "API key not configured. Please set GEMINI_API_KEY environment variable."
                    continue

                # Gemini API expects a different payload
                payload = {
                    "contents": [
                        {"parts": [{"text": messages[0]["content"] if isinstance(messages[0], dict) else messages[0]["content"][0]["text"]}]}
                    ]
                }
                params = {"key": GEMINI_API_KEY}

                max_retries = 3
                retry_delay = 2
                for attempt in range(max_retries):
                    try:
                        response = session.post(
                            GEMINI_API_URL,
                            params=params,
                            json=payload,
                            timeout=60 if supports_vision else 30
                        )
                        response.raise_for_status()
                        result = response.json()
                        answer = result["candidates"][0]["content"]["parts"][0]["text"]
                        if not is_agricultural_response(answer):
                            answer = "Could not generate agricultural analysis. Please try again with a farming-related query or agricultural image."
                        else:
                            answer = clean_farmer_response(answer)
                        responses[model_name] = answer
                        logger.info(f"Successfully processed {model_name} response")
                        break
                    except Exception as e:
                        if attempt < max_retries - 1:
                            logger.warning(f"Gemini API error, attempt {attempt + 1}/{max_retries}: {str(e)}")
                            time.sleep(retry_delay)
                            retry_delay *= 2
                            continue
                        else:
                            responses[model_name] = f"Gemini API error: {str(e)}"
                            
                    except requests.exceptions.ConnectionError as e:
                        if attempt < max_retries - 1:
                            logger.warning(f"Connection error for {model_name}, attempt {attempt + 1}/{max_retries}: {str(e)}")
                            time.sleep(retry_delay)
                            retry_delay *= 2  # Exponential backoff
                            continue
                        else:
                            responses[model_name] = "Connection error: Unable to reach AI service. Please check your internet connection and try again."
                            logger.error(f"Model {model_name} connection failed after {max_retries} attempts: {str(e)}")
                            
                    except requests.exceptions.Timeout as e:
                        if attempt < max_retries - 1:
                            logger.warning(f"Timeout for {model_name}, attempt {attempt + 1}/{max_retries}: {str(e)}")
                            time.sleep(retry_delay)
                            retry_delay *= 2
                            continue
                        else:
                            responses[model_name] = "Request timed out. The AI service is taking too long to respond. Please try again."
                            logger.error(f"Model {model_name} timed out after {max_retries} attempts: {str(e)}")
                            
                    except requests.exceptions.HTTPError as e:
                        error_msg = f"API error: {str(e)}"
                        if e.response.status_code == 400:
                            try:
                                error_data = e.response.json()
                                error_msg = error_data.get("error", {}).get("message", error_msg)
                            except:
                                pass
                        elif e.response.status_code == 401:
                            error_msg = "Authentication failed. Please check your API key."
                        elif e.response.status_code == 429:
                            error_msg = "Rate limit exceeded. Please wait a moment and try again."
                        elif e.response.status_code >= 500:
                            if attempt < max_retries - 1:
                                logger.warning(f"Server error for {model_name}, attempt {attempt + 1}/{max_retries}: {str(e)}")
                                time.sleep(retry_delay)
                                retry_delay *= 2
                                continue
                            else:
                                error_msg = "AI service is temporarily unavailable. Please try again later."
                        
                        responses[model_name] = f"Analysis unavailable: {error_msg}"
                        logger.warning(f"Model {model_name} failed: {error_msg}")
                        break  # Don't retry HTTP errors
                        
                    except Exception as e:
                        if attempt < max_retries - 1:
                            logger.warning(f"Unexpected error for {model_name}, attempt {attempt + 1}/{max_retries}: {str(e)}")
                            time.sleep(retry_delay)
                            retry_delay *= 2
                            continue
                        else:
                            responses[model_name] = f"Unexpected error: {str(e)}"
                            logger.error(f"Model {model_name} error: {str(e)}")
                
            except Exception as e:
                responses[model_name] = f"Service error: {str(e)}"
                logger.error(f"Model {model_name} setup error: {str(e)}")

        return {
            "success": True,
            "message": "Farmer Assistant Analysis Complete",
            "input_type": {
                "has_image": encoded_image is not None,
                "has_text": text_input is not None
            },
            "responses": responses
        }

    except Exception as e:
        logger.error(f"Farmer assistant analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/health")
async def health_check():
    """Health check endpoint for the farmer assistant service"""
    return {
        "status": "healthy",
        "service": "Farmer Assistant AI",
        "models_available": ["llama-3.3-70b-versatile", "llama-3.2-11b-vision-preview"],
        "capabilities": ["text_analysis", "image_analysis", "agricultural_guidance"],
        "model_types": {
            "text_only": "llama-3.3-70b-versatile",
            "vision": "llama-3.2-11b-vision-preview"
        }
    }

@router.get("/capabilities")
async def get_capabilities():
    """Get information about what the farmer assistant can do"""
    return {
        "service": "Professional Farmer Assistant",
        "capabilities": {
            "image_analysis": [
                "Crop health assessment",
                "Soil condition analysis", 
                "Pest and disease identification",
                "Growth stage evaluation",
                "Irrigation system analysis"
            ],
            "text_queries": [
                "Crop management advice",
                "Soil fertility recommendations",
                "Pest control strategies",
                "Irrigation best practices",
                "Harvest timing guidance",
                "Weather impact assessment",
                "Organic farming methods",
                "Sustainable agriculture practices"
            ],
            "professional_features": [
                "Agricultural terminology",
                "Practical recommendations",
                "Best practices guidance",
                "Regional considerations",
                "Expert consultation advice"
            ]
        }
    }

@router.get("/test-api")
async def test_api_connection():
    """Test the connection to Gemini API"""
    if not GEMINI_API_KEY:
        return {
            "status": "error",
            "message": "API key not configured",
            "details": "Please set GEMINI_API_KEY environment variable"
        }
    try:
        payload = {
            "contents": [
                {"parts": [{"text": "Hello"}]}
            ]
        }
        params = {"key": GEMINI_API_KEY}
        response = session.post(
            GEMINI_API_URL,
            params=params,
            json=payload,
            timeout=10
        )
        response.raise_for_status()
        return {
            "status": "success",
            "message": "API connection successful",
            "api_key_configured": True
        }
    except requests.exceptions.ConnectionError:
        return {
            "status": "error",
            "message": "Connection failed",
            "details": "Unable to reach Gemini API. Check your internet connection."
        }
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 401:
            return {
                "status": "error",
                "message": "Authentication failed",
                "details": "Invalid API key. Please check your GEMINI_API_KEY."
            }
        else:
            return {
                "status": "error",
                "message": f"API error: {e.response.status_code}",
                "details": str(e)
            }
    except Exception as e:
        return {
            "status": "error",
            "message": "Unexpected error",
            "details": str(e)
        }

@router.post("/text-query")
async def text_only_query(query: str = Form(...)):
    """
    Handle text-only farming queries using the versatile model.
    - **query**: Your farming-related question or agricultural issue description
    """
    try:
        if not query or not query.strip():
            raise HTTPException(
                status_code=400,
                detail="Query text is required"
            )
        text_input = query.strip()
        if not GEMINI_API_KEY:
            raise HTTPException(
                status_code=500,
                detail="API key not configured. Please set GEMINI_API_KEY environment variable."
            )
        payload = {
            "contents": [
                {"parts": [{"text": text_input}]}
            ]
        }
        params = {"key": GEMINI_API_KEY}
        max_retries = 3
        retry_delay = 2
        for attempt in range(max_retries):
            try:
                response = session.post(
                    GEMINI_API_URL,
                    params=params,
                    json=payload,
                    timeout=30
                )
                response.raise_for_status()
                result = response.json()
                answer = result["candidates"][0]["content"]["parts"][0]["text"]
                if not is_agricultural_response(answer):
                    answer = "Could not generate agricultural analysis. Please try again with a farming-related query."
                else:
                    answer = clean_farmer_response(answer)
                logger.info("Successfully processed text-only query")
                return {
                    "success": True,
                    "message": "Text Query Analysis Complete",
                    "query": text_input,
                    "response": answer,
                    "model_used": "gemini-pro"
                }
            except Exception as e:
                if attempt < max_retries - 1:
                    logger.warning(f"Gemini API error, attempt {attempt + 1}/{max_retries}: {str(e)}")
                    time.sleep(retry_delay)
                    retry_delay *= 2
                    continue
                else:
                    raise HTTPException(status_code=500, detail=f"Analysis unavailable: Gemini API error: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Text query error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}") 