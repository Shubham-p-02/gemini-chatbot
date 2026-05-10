# Gemini Chatbot - Project Report

## Overview
This project is a full-stack, AI-powered conversational application developed as part of the Infollion Software Developer Intern assignment. It provides a modern, responsive, and intuitive interface for users to interact with Google's Gemini LLM. 

A major focus of this implementation was on **user experience**, **robust file-handling capabilities**, and **production-readiness**, going beyond a simple text interface to support complex multi-modal inputs.

---

## 🛠 Technology Stack
- **Frontend**: React 19, Vite, vanilla CSS (custom design system, glassmorphism UI)
- **Backend**: Node.js, Express.js
- **AI Integration**: Google Generative AI SDK (`@google/generative-ai`), specifically utilizing the `gemini-1.5-flash` model for high-speed, multimodal inference.
- **File Processing**: `multer` (in-memory file handling), `pdf-parse` (PDF text extraction)
- **Deployment**: Vercel (Frontend SPA) and Render (Backend API)

---

## ✨ Key Features & "Plus Points"

### 1. Multi-modal Context Support (Text, PDF, Images)
The chatbot doesn't just read text; it understands documents. 
- **PDF & TXT Parsing**: Users can upload `.pdf` and `.txt` files. The backend seamlessly extracts the raw text and injects it into the LLM's system context, allowing users to "chat with their documents."
- **Image Vision Integration**: Users can upload `.png`, `.jpg`, and `.webp` images. These are converted to base64 inline data and sent directly to Gemini's vision-capable model, allowing the AI to "see" and analyze user-provided images.

### 2. Session Management & Context Retention
- The backend utilizes an in-memory `Map` store to maintain independent conversational histories based on unique `chatId`s.
- This allows the AI to remember the context of the current conversation without cross-pollinating data between different user sessions or new chats.
- A dedicated **"New Chat"** feature allows users to instantly wipe the current context and start fresh.

### 3. Premium UI/UX Design
The interface was custom-built without relying on heavy CSS frameworks, demonstrating strong fundamental frontend skills. 
- **Glassmorphism & Gradients**: A sleek dark mode utilizing CSS backdrop filters, smooth transitions, and linear gradients.
- **Micro-interactions**: Typing indicators (animated dots), smooth auto-scrolling to the latest message, and hover states on all interactive elements.
- **File Previews**: When a user uploads a file, a visual "chip" appears in the input bar showing the file type and name before sending.
- **Markdown Rendering**: AI responses are parsed through `react-markdown` to properly display bold text, bullet points, and code blocks.

### 4. Production-Ready Deployment
The application is not just a local prototype; it has been configured and deployed using modern CI/CD workflows.
- The React frontend is deployed as a static Single Page Application (SPA) on **Vercel**, with proper routing rewrites.
- The Express backend is deployed as a live web service on **Render**.
- Environment variables (`VITE_API_URL` and `GEMINI_API_KEY`) are properly separated and secured, ensuring API keys are never exposed to the client browser.

---

## 🏗 System Architecture

1. **Client Layer**: The React app captures user input and files. Files are appended to a `FormData` object and sent via a `POST` request to the backend.
2. **API Layer (Express)**: 
   - `multer` intercepts the file upload and holds it in memory.
   - If the file is a PDF, `pdf-parse` extracts the text.
   - If the file is an image, it is converted to a base64 string.
3. **AI Service Layer**: The extracted text or image data is formatted into Google Generative AI's required schema (`inlineData` for images, `text` for context) alongside the conversation history.
4. **Response**: The Gemini API returns the generated content, which the backend forwards to the client, where it is appended to the UI state and rendered via Markdown.

---

## 🚀 How to Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Shubham-p-02/gemini-chatbot.git
   ```
2. **Setup Backend**:
   ```bash
   cd server
   npm install
   # Create a .env file and add: GEMINI_API_KEY=your_api_key
   npm start
   ```
3. **Setup Frontend**:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser.
