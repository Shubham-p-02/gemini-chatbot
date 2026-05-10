export default function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  isOpen,
  onClose,
}) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">✦</div>
            <span className="sidebar-brand-text">Gemini Chat</span>
          </div>
          <button className="new-chat-btn" onClick={onNewChat} id="new-chat-btn">
            <span>＋</span> New Chat
          </button>
        </div>

        <div className="sidebar-chats">
          {chats.length > 0 && (
            <div className="sidebar-chats-label">Recent</div>
          )}

          {chats.length === 0 ? (
            <div className="sidebar-empty">
              <p>No conversations yet</p>
              <p style={{ marginTop: 4, fontSize: 12, opacity: 0.6 }}>
                Click "New Chat" to start
              </p>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`chat-item ${chat.id === activeChatId ? 'active' : ''}`}
                onClick={() => {
                  onSelectChat(chat.id);
                  onClose?.();
                }}
              >
                <span className="chat-item-icon">
                  {chat.hasImage ? '🖼️' : chat.hasDocument ? '📄' : '💬'}
                </span>
                <span className="chat-item-title">{chat.title}</span>
                <button
                  className="chat-item-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  title="Delete chat"
                >
                  🗑
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
