export default function LoadingIndicator() {
  return (
    <div className="loading-message">
      <div className="message-avatar" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
        ✨
      </div>
      <div className="loading-dots">
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
      </div>
    </div>
  );
}
