const express = require("express");
const router = express.Router();
const multer = require("multer");
const chatStore = require("../store/chatStore");
const { extractText } = require("../services/fileProcessor");

// Configure multer for memory storage (no disk writes)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: PDF, TXT, PNG, JPG`));
    }
  },
});

// Upload a file to a chat
router.post("/:chatId/upload", upload.single("file"), async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = chatStore.getChat(chatId);
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { buffer, mimetype, originalname } = req.file;

    // Handle document files (PDF, TXT)
    if (mimetype === "application/pdf" || mimetype === "text/plain") {
      const text = await extractText(buffer, mimetype, originalname);
      chatStore.setDocument(chatId, text, originalname);
      return res.json({
        success: true,
        type: "document",
        filename: originalname,
        textLength: text.length,
        preview: text.substring(0, 200) + (text.length > 200 ? "..." : ""),
      });
    }

    // Handle image files (PNG, JPG)
    if (mimetype.startsWith("image/")) {
      const base64 = buffer.toString("base64");
      chatStore.setImage(chatId, base64, mimetype, originalname);
      return res.json({
        success: true,
        type: "image",
        filename: originalname,
        mimeType: mimetype,
        // Send back base64 for frontend preview
        preview: `data:${mimetype};base64,${base64}`,
      });
    }

    res.status(400).json({ error: "Unsupported file type" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Multer error handling
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large. Maximum size is 10MB." });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

module.exports = router;
