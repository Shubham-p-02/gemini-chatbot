import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import LoadingIndicator from './LoadingIndicator';

export default function ChatWindow({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="chat-window">
        <div className="chat-messages">
          <div className="welcome" style={{ minHeight: '60vh' }}>
            <div style={{ fontSize: '40px', opacity: 0.6 }}>💬</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              Start a conversation — type a message, upload a document, or share an image.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            role={msg.role}
            content={msg.content}
            attachment={msg.attachment}
            imagePreview={msg.imagePreview}
          />
        ))}
        {isLoading && <LoadingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
