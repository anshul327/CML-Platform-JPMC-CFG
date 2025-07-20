import axios from "axios";

export const sendSMS = async (req, res) => {
  let { message, numbers } = req.body;

  // Validate input
  if (!message || !numbers) {
    return res
      .status(400)
      .json({ success: false, error: "Message and numbers are required." });
  }

  // If numbers is an array, join to comma-separated string
  if (Array.isArray(numbers)) {
    numbers = numbers.join(",");
  }

  if (!process.env.FAST2SMS_API_KEY) {
    return res
      .status(500)
      .json({ success: false, error: "SMS API key not configured." });
  }

  try {
    // Mock response for development/testing
    if (1) {
      return res.status(200).json({
        success: true,
        data: {
          message: "SMS sent!",
          numbers,
          messageContent: message
        }
      });
    }

    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "q",
        message,
        numbers, // Comma-separated string e.g., "9999999999,8888888888"
        flash: 0,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        error: error.response?.data || error.message,
      });
  }
};

// Controller to send SMS about various government schemes
export const sendSchemesSMS = async (req, res) => {
  let { schemes, numbers } = req.body;

  // Validate input
  if (!schemes || !numbers) {
    return res
      .status(400)
      .json({ success: false, error: "Schemes and numbers are required." });
  }

  // If numbers is an array, join to comma-separated string
  if (Array.isArray(numbers)) {
    numbers = numbers.join(",");
  }

  // If schemes is an array, join to a single message string
  let message;
  if (Array.isArray(schemes)) {
    message = "Government Schemes:\n" + schemes.map((s, i) => `${i + 1}. ${s}`).join("\n");
  } else {
    message = `Government Scheme: ${schemes}`;
  }

  if (!process.env.FAST2SMS_API_KEY) {
    return res
      .status(500)
      .json({ success: false, error: "SMS API key not configured." });
  }

  try {
    // Mock response for development/testing
    if (1) {
      return res.status(200).json({
        success: true,
        data: {
          message: "Schemes SMS sent!",
          numbers,
          messageContent: message
        }
      });
    }

    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "q",
        message,
        numbers,
        flash: 0,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        error: error.response?.data || error.message,
      });
  }
};