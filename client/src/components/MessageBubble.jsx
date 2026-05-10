import ReactMarkdown from 'react-markdown';

export default function MessageBubble({ role, content, attachment, imagePreview }) {
  const isUser = role === 'user';

  return (
    <div className={`message ${isUser ? 'user' : 'bot'}`}>
      <div className="message-avatar">
        {isUser ? '👤' : '✨'}
      </div>
      <div className="message-content">
        <div className="message-bubble">
          {isUser ? (
            <p>{content}</p>
          ) : (
            <ReactMarkdown>{content}</ReactMarkdown>
          )}
        </div>
        {attachment && (
          <div className="message-attachment">
            <span>{attachment.type === 'image' ? '🖼️' : '📄'}</span>
            <span>{attachment.filename}</span>
          </div>
        )}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Uploaded"
            className="message-image-preview"
          />
        )}
      </div>
    </div>
  );
}
