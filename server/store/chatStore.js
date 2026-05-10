const { v4: uuidv4 } = require("uuid");

/**
 * In-memory chat store.
 * Structure: Map<chatId, { id, title, messages[], documentText, documentName, imageData, imageName }>
 */
const chats = new Map();

function createChat() {
  const id = uuidv4();
  const chat = {
    id,
    title: "New Chat",
    messages: [],
    documentText: null,
    documentName: null,
    imageData: null,
    imageMimeType: null,
    imageName: null,
    createdAt: Date.now(),
  };
  chats.set(id, chat);
  return chat;
}

function getChat(chatId) {
  return chats.get(chatId) || null;
}

function listChats() {
  return Array.from(chats.values())
    .map((c) => ({
      id: c.id,
      title: c.title,
      messageCount: c.messages.length,
      hasDocument: !!c.documentText,
      hasImage: !!c.imageData,
      createdAt: c.createdAt,
    }))
    .sort((a, b) => b.createdAt - a.createdAt);
}

function addMessage(chatId, role, content) {
  const chat = chats.get(chatId);
  if (!chat) return null;
  const message = { role, content, timestamp: Date.now() };
  chat.messages.push(message);
  // Update title from first user message
  if (role === "user" && chat.messages.filter((m) => m.role === "user").length === 1) {
    chat.title = content.substring(0, 50) + (content.length > 50 ? "..." : "");
  }
  return message;
}

function setDocument(chatId, text, filename) {
  const chat = chats.get(chatId);
  if (!chat) return false;
  chat.documentText = text;
  chat.documentName = filename;
  return true;
}

function setImage(chatId, base64Data, mimeType, filename) {
  const chat = chats.get(chatId);
  if (!chat) return false;
  chat.imageData = base64Data;
  chat.imageMimeType = mimeType;
  chat.imageName = filename;
  return true;
}

function deleteChat(chatId) {
  return chats.delete(chatId);
}

module.exports = {
  createChat,
  getChat,
  listChats,
  addMessage,
  setDocument,
  setImage,
  deleteChat,
};
