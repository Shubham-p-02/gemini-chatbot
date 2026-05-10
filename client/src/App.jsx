import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import * as api from './utils/api';

export default function App() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState({}); // chatId -> messages[]
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatContextInfo, setChatContextInfo] = useState({}); // chatId -> { doc, img }

  // Show error toast for 4 seconds
  const showError = useCallback((msg) => {
    setError(msg);
    setTimeout(() => setError(null), 4000);
  }, []);

  // Create a new chat
  const handleNewChat = useCallback(async () => {
    try {
      const { chatId, title } = await api.createChat();
      const newChat = { id: chatId, title, messageCount: 0, hasDocument: false, hasImage: false };
      setChats((prev) => [newChat, ...prev]);
      setMessages((prev) => ({ ...prev, [chatId]: [] }));
      setChatContextInfo((prev) => ({ ...prev, [chatId]: {} }));
      setActiveChatId(chatId);
    } catch (err) {
      showError('Failed to create chat: ' + err.message);
    }
  }, [showError]);

  // Switch active chat
  const handleSelectChat = useCallback(async (chatId) => {
    setActiveChatId(chatId);
    // Load messages if not cached
    if (!messages[chatId]) {
      try {
        const data = await api.getChat(chatId);
        setMessages((prev) => ({ ...prev, [chatId]: data.messages || [] }));
        setChatContextInfo((prev) => ({
          ...prev,
          [chatId]: { documentName: data.documentName, imageName: data.imageName },
        }));
      } catch (err) {
        showError('Failed to load chat: ' + err.message);
      }
    }
  }, [messages, showError]);

  // Delete a chat
  const handleDeleteChat = useCallback(async (chatId) => {
    try {
      await api.deleteChat(chatId);
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      setMessages((prev) => {
        const copy = { ...prev };
        delete copy[chatId];
        return copy;
      });
      setChatContextInfo((prev) => {
        const copy = { ...prev };
        delete copy[chatId];
        return copy;
      });
      if (activeChatId === chatId) {
        setActiveChatId(null);
      }
    } catch (err) {
      showError('Failed to delete chat: ' + err.message);
    }
  }, [activeChatId, showError]);

  // Upload a file
  const handleFileUpload = useCallback(async (file) => {
    if (!activeChatId) return;
    try {
      const result = await api.uploadFile(activeChatId, file);
      // Update context info
      setChatContextInfo((prev) => ({
        ...prev,
        [activeChatId]: {
          ...prev[activeChatId],
          ...(result.type === 'document' ? { documentName: result.filename } : {}),
          ...(result.type === 'image' ? { imageName: result.filename } : {}),
        },
      }));
      // Update chat list
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? {
                ...c,
                hasDocument: c.hasDocument || result.type === 'document',
                hasImage: c.hasImage || result.type === 'image',
              }
            : c
        )
      );
      return result;
    } catch (err) {
      showError('Upload failed: ' + err.message);
      throw err;
    }
  }, [activeChatId, showError]);

  // Send a message
  const handleSend = useCallback(async (text, attachment, imagePreview) => {
    if (!activeChatId) return;

    // Add user message to UI immediately
    const userMsg = { role: 'user', content: text, attachment, imagePreview };
    setMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), userMsg],
    }));

    setIsLoading(true);
    try {
      const { response, chatTitle } = await api.sendMessage(activeChatId, text);

      // Add bot response
      setMessages((prev) => ({
        ...prev,
        [activeChatId]: [
          ...(prev[activeChatId] || []),
          { role: 'model', content: response },
        ],
      }));

      // Update chat title in sidebar
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? { ...c, title: chatTitle, messageCount: (c.messageCount || 0) + 2 }
            : c
        )
      );
    } catch (err) {
      showError('Failed to get response: ' + err.message);
      // Remove the user message on error
      setMessages((prev) => ({
        ...prev,
        [activeChatId]: (prev[activeChatId] || []).slice(0, -1),
      }));
    } finally {
      setIsLoading(false);
    }
  }, [activeChatId, showError]);

  const activeMessages = messages[activeChatId] || [];
  const activeContext = chatContextInfo[activeChatId] || {};

  return (
    <div className="app">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main">
        {/* Mobile header */}
        <div className="mobile-header">
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <span className="sidebar-brand-text">Gemini Chat</span>
        </div>

        {!activeChatId ? (
          /* Welcome screen */
          <div className="welcome">
            <div className="welcome-icon">✦</div>
            <h1>Gemini Chatbot</h1>
            <p>Start a conversation with AI. Upload documents and images for context-aware answers.</p>
            <div className="welcome-features">
              <div className="welcome-feature" onClick={handleNewChat} style={{ cursor: 'pointer' }}>
                <span className="welcome-feature-icon">💬</span>
                <span>Text Chat</span>
              </div>
              <div className="welcome-feature" onClick={handleNewChat} style={{ cursor: 'pointer' }}>
                <span className="welcome-feature-icon">📄</span>
                <span>Document Q&A</span>
              </div>
              <div className="welcome-feature" onClick={handleNewChat} style={{ cursor: 'pointer' }}>
                <span className="welcome-feature-icon">🖼️</span>
                <span>Image Analysis</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Context badges */}
            {(activeContext.documentName || activeContext.imageName) && (
              <div className="context-bar">
                {activeContext.documentName && (
                  <div className="context-badge">
                    <span className="context-badge-icon">📄</span>
                    {activeContext.documentName}
                  </div>
                )}
                {activeContext.imageName && (
                  <div className="context-badge">
                    <span className="context-badge-icon">🖼️</span>
                    {activeContext.imageName}
                  </div>
                )}
              </div>
            )}

            <ChatWindow messages={activeMessages} isLoading={isLoading} />

            <InputBar
              onSend={handleSend}
              onFileUpload={handleFileUpload}
              disabled={isLoading}
            />
          </>
        )}
      </div>

      {/* Error toast */}
      {error && <div className="error-toast">{error}</div>}
    </div>
  );
}
