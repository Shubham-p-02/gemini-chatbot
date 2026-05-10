require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initializeGemini } = require("./services/gemini");
const chatRoutes = require("./routes/chat");
const uploadRoutes = require("./routes/upload");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/chats", chatRoutes);
app.use("/api/chats", uploadRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Initialize Gemini and start server
initializeGemini();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
