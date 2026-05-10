# ✦ Gemini Chatbot

A web-based chatbot powered by Google's **Gemini API** that supports text conversation, document upload (PDF/TXT), image upload (PNG/JPG), and session-based chat context.

![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)
![Gemini](https://img.shields.io/badge/AI-Gemini_1.5_Flash-4285F4?logo=google&logoColor=white)

---

## ✨ Features

| Feature | Description |
|---|---|
| 💬 **Text Chat** | Natural conversation with Gemini AI |
| 📄 **Document Q&A** | Upload PDF/TXT files and ask questions about their content |
| 🖼️ **Image Analysis** | Upload PNG/JPG images for visual understanding |
| 🔄 **Chat Context** | Full conversation history maintained per session |
| 🆕 **New Chat / Reset** | Start fresh with a clean context at any time |
| 📋 **Multiple Chats** | Manage multiple conversations in the sidebar |
| ⏳ **Loading Indicators** | Visual feedback during API calls and file uploads |
| 📱 **Responsive Design** | Works on desktop and mobile devices |

---

## 📋 Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Google Gemini API Key** (free tier available)

---

## 🔑 Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Select or create a Google Cloud project
5. Copy the generated API key

> **Note:** The free tier of Gemini API provides generous rate limits suitable for development and personal use.

---

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/gemini-chatbot.git
cd gemini-chatbot
```

### 2. Set up the Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```bash
cp ../.env.example .env
```

Edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Set up the Frontend

```bash
cd ../client
npm install
```

### 4. Run the Application

**Terminal 1 — Start the Backend:**

```bash
cd server
npm run dev
```

The backend will start on `http://localhost:3001`

**Terminal 2 — Start the Frontend:**

```bash
cd client
npm run dev
```

The frontend will start on `http://localhost:5173`

### 5. Open the App

Navigate to **http://localhost:5173** in your browser.

---

## 📖 Usage Examples

### Example 1: Document Q&A

1. Click **"New Chat"** to start a conversation
2. Click the 📄 button and upload a PDF or TXT file
3. Type: *"Summarize the document."* → Send
4. Follow up: *"What was the third point mentioned?"*
5. The bot uses the document + conversation context to answer

### Example 2: Image Analysis

1. Click **"New Chat"**
2. Click the 🖼️ button and upload a PNG or JPG image
3. Type: *"What's in the image?"* → Send
4. Follow up: *"Is the person smiling?"*
5. The bot uses the same uploaded image for follow-ups

### Example 3: Context Reset

1. After chatting, ask: *"What did I upload earlier?"*
2. Bot responds with details about your uploads
3. Click **"New Chat"**
4. Ask again: *"What did I upload earlier?"*
5. Bot responds: *"No files have been uploaded yet."* (fresh context)

---

## 🏗️ Project Structure

```
gemini-chatbot/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx             # Main application shell
│   │   ├── App.css             # Design system & styles
│   │   ├── main.jsx            # React entry point
│   │   ├── components/
│   │   │   ├── Sidebar.jsx     # Chat list + new chat
│   │   │   ├── ChatWindow.jsx  # Message display area
│   │   │   ├── MessageBubble.jsx  # Individual messages
│   │   │   ├── InputBar.jsx    # Text input + file uploads
│   │   │   ├── FilePreview.jsx # Upload preview chips
│   │   │   └── LoadingIndicator.jsx
│   │   └── utils/
│   │       └── api.js          # API client
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                     # Node.js backend (Express)
│   ├── index.js                # Server entry point
│   ├── routes/
│   │   ├── chat.js             # Chat CRUD + messaging
│   │   └── upload.js           # File upload handling
│   ├── services/
│   │   ├── gemini.js           # Gemini API integration
│   │   └── fileProcessor.js    # PDF/TXT text extraction
│   ├── store/
│   │   └── chatStore.js        # In-memory chat state
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chats` | Create a new chat session |
| `GET` | `/api/chats` | List all active chats |
| `GET` | `/api/chats/:chatId` | Get chat details + messages |
| `POST` | `/api/chats/:chatId/message` | Send a message, get AI response |
| `POST` | `/api/chats/:chatId/upload` | Upload a file (PDF/TXT/PNG/JPG) |
| `DELETE` | `/api/chats/:chatId` | Delete a chat session |
| `GET` | `/api/health` | Health check endpoint |

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite 6, react-markdown
- **Backend:** Node.js, Express 4, Multer, pdf-parse
- **AI:** Google Gemini 1.5 Flash via @google/generative-ai SDK
- **State:** In-memory (Map) — no database required

---

## 🚢 Deployment

### Frontend → Vercel

1. Push the repo to GitHub
2. Import the repo on [Vercel](https://vercel.com)
3. Set the **Root Directory** to `client`
4. Add environment variable: `VITE_API_URL` = your Render backend URL
5. Deploy

### Backend → Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repo
3. Set the **Root Directory** to `server`
4. Set **Build Command** to `npm install`
5. Set **Start Command** to `npm start`
6. Add environment variable: `GEMINI_API_KEY` = your API key
7. Deploy

---

## 📄 License

MIT
