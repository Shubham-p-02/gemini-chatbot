const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;
let model = null;

function initializeGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    console.warn("⚠️  GEMINI_API_KEY not set. Chat will not work until a valid key is provided.");
    return false;
  }
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
  console.log("✅ Gemini API initialized (gemini-flash-latest)");
  return true;
}

/**
 * Send a message to Gemini with full conversation context.
 *
 * @param {Array} chatHistory - Array of { role, content } messages
 * @param {string|null} documentText - Extracted document text (if any)
 * @param {object|null} imageData - { base64, mimeType } (if any)
 * @param {string} userMessage - The current user message
 * @returns {string} - The model's response text
 */
async function sendMessage(chatHistory, documentText, imageData, userMessage) {
  if (!model) {
    throw new Error("Gemini API not initialized. Please set GEMINI_API_KEY in your .env file.");
  }

  // Build the content parts for the API call
  const contents = [];

  // Add system-like context for document
  if (documentText) {
    contents.push({
      role: "user",
      parts: [
        {
          text: `[SYSTEM CONTEXT] The user has uploaded a document. Here is its content:\n\n---\n${documentText}\n---\n\nPlease use this document content to answer questions about it.`,
        },
      ],
    });
    contents.push({
      role: "model",
      parts: [
        {
          text: "I have received and read the document. I'll use its content to help answer your questions.",
        },
      ],
    });
  }

  // Add conversation history (excluding the current message)
  for (const msg of chatHistory) {
    contents.push({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    });
  }

  // Build current message parts
  const currentParts = [];

  // If there's an image, include it
  if (imageData) {
    currentParts.push({
      inlineData: {
        mimeType: imageData.mimeType,
        data: imageData.base64,
      },
    });
  }

  currentParts.push({ text: userMessage });

  contents.push({
    role: "user",
    parts: currentParts,
  });

  try {
    const result = await model.generateContent({ contents });
    const response = result.response;
    return response.text();
  } catch (err) {
    console.error("Gemini API error:", err.message);
    throw new Error(`Gemini API error: ${err.message}`);
  }
}

module.exports = { initializeGemini, sendMessage };
