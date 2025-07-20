from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Farmer Assistant AI",
    description="Professional AI assistant for agricultural guidance and crop analysis",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include only the farmer assistant router
from app.routers import farmerAssistant
app.include_router(farmerAssistant.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "Farmer Assistant AI Service",
        "description": "Professional agricultural AI assistant for crop analysis and farming guidance",
        "version": "1.0.0",
        "endpoints": {
            "text_query": "/api/v1/farmer-assistant/text-query",
            "image_analysis": "/api/v1/farmer-assistant/analyze",
            "health_check": "/api/v1/farmer-assistant/health",
            "capabilities": "/api/v1/farmer-assistant/capabilities",
            "test_api": "/api/v1/farmer-assistant/test-api"
        }
    }

@app.get("/test")
async def test():
    return {"message": "Farmer Assistant AI is working"}

@app.on_event("startup")
async def print_routes():
    print("🌾 Farmer Assistant AI Service Started")
    print("Available routes:")
    for route in app.routes:
        if hasattr(route, 'path'):
            print(f"  {route.path} - {route.methods}")

