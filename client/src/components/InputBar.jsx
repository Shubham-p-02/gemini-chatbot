import { useState, useRef, useEffect } from 'react';
import FilePreview from './FilePreview';

export default function InputBar({ onSend, onFileUpload, disabled }) {
  const [message, setMessage] = useState('');
  const [stagedFile, setStagedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const textareaRef = useRef(null);
  const docInputRef = useRef(null);
  const imgInputRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed && !stagedFile) return;
    if (disabled || uploading) return;

    let attachment = null;
    let imgPreview = null;

    // Upload file first if staged
    if (stagedFile) {
      try {
        setUploading(true);
        const result = await onFileUpload(stagedFile);
        attachment = { type: result.type, filename: result.filename };
        if (result.type === 'image') {
          imgPreview = result.preview;
        }
      } catch (err) {
        setUploading(false);
        return; // Error handled by parent
      }
      setUploading(false);
    }

    const msgToSend = trimmed || `[Uploaded ${stagedFile?.name}]`;
    setMessage('');
    setStagedFile(null);
    setImagePreviewUrl(null);
    onSend(msgToSend, attachment, imgPreview);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStagedFile(file);

    // Generate preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setImagePreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl(null);
    }

    e.target.value = ''; // Reset input
  };

  const removeStagedFile = () => {
    setStagedFile(null);
    setImagePreviewUrl(null);
  };

  return (
    <div className="input-area">
      {/* Staged file preview */}
      {stagedFile && (
        <div className="file-preview-bar">
          <FilePreview
            file={stagedFile}
            uploading={uploading}
            onRemove={uploading ? null : removeStagedFile}
          />
        </div>
      )}

      {/* Image thumbnail preview */}
      {imagePreviewUrl && (
        <div style={{ marginBottom: 10 }}>
          <img src={imagePreviewUrl} alt="Preview" className="image-preview-thumb" />
        </div>
      )}

      {/* Input bar */}
      <div className="input-bar">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          disabled={disabled || uploading}
          id="chat-input"
        />

        <div className="input-actions">
          {/* Document upload */}
          <button
            className="input-btn"
            onClick={() => docInputRef.current?.click()}
            disabled={disabled || uploading}
            title="Upload document (PDF, TXT)"
            id="upload-doc-btn"
          >
            📄
            <input
              ref={docInputRef}
              type="file"
              accept=".pdf,.txt,application/pdf,text/plain"
              onChange={handleFileSelect}
            />
          </button>

          {/* Image upload */}
          <button
            className="input-btn"
            onClick={() => imgInputRef.current?.click()}
            disabled={disabled || uploading}
            title="Upload image (PNG, JPG)"
            id="upload-img-btn"
          >
            🖼️
            <input
              ref={imgInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,image/png,image/jpeg"
              onChange={handleFileSelect}
            />
          </button>

          {/* Send */}
          <button
            className="input-btn send-btn"
            onClick={handleSend}
            disabled={disabled || uploading || (!message.trim() && !stagedFile)}
            title="Send message"
            id="send-btn"
          >
            ➤
          </button>
        </div>
      </div>

      <div className="input-hint">
        Press Enter to send · Shift+Enter for new line
      </div>
    </div>
  );
}
