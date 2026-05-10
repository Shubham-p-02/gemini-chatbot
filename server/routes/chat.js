const express = require("express");
const router = express.Router();
const chatStore = require("../store/chatStore");
const geminiService = require("../services/gemini");

// Create a new chat
router.post("/", (req, res) => {
  const chat = chatStore.createChat();
  res.status(201).json({ chatId: chat.id, title: chat.title });
});

// List all chats
router.get("/", (req, res) => {
  const chats = chatStore.listChats();
  res.json(chats);
});

// Get a specific chat (with full messages)
router.get("/:chatId", (req, res) => {
  const chat = chatStore.getChat(req.params.chatId);
  if (!chat) return res.status(404).json({ error: "Chat not found" });
  res.json({
    id: chat.id,
    title: chat.title,
    messages: chat.messages,
    documentName: chat.documentName,
    imageName: chat.imageName,
    hasDocument: !!chat.documentText,
    hasImage: !!chat.imageData,
  });
});

// Send a message to a chat
router.post("/:chatId/message", async (req, res) => {
  const { chatId } = req.params;
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  const chat = chatStore.getChat(chatId);
  if (!chat) return res.status(404).json({ error: "Chat not found" });

  // Add user message to history
  chatStore.addMessage(chatId, "user", message.trim());

  try {
    // Build image data object if available
    let imageData = null;
    if (chat.imageData) {
      imageData = {
        base64: chat.imageData,
        mimeType: chat.imageMimeType,
      };
    }

    // Send to Gemini with full context
    const botResponse = await geminiService.sendMessage(
      chat.messages.slice(0, -1), // history excluding current message
      chat.documentText,
      imageData,
      message.trim()
    );

    // Add bot response to history
    chatStore.addMessage(chatId, "model", botResponse);

    res.json({
      response: botResponse,
      chatTitle: chat.title,
    });
  } catch (err) {
    // Remove the user message if Gemini fails
    chat.messages.pop();
    res.status(500).json({ error: err.message });
  }
});

// Delete a chat
router.delete("/:chatId", (req, res) => {
  const deleted = chatStore.deleteChat(req.params.chatId);
  if (!deleted) return res.status(404).json({ error: "Chat not found" });
  res.json({ success: true });
});

module.exports = router;
