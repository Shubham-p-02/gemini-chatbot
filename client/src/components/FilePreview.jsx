export default function FilePreview({ file, uploading, onRemove }) {
  const isImage = file.type?.startsWith('image/');
  const icon = isImage ? '🖼️' : file.name?.endsWith('.pdf') ? '📄' : '📝';

  return (
    <div className={`file-chip ${uploading ? 'file-chip-uploading' : ''}`}>
      {uploading ? (
        <div className="spinner"></div>
      ) : (
        <span className="file-chip-icon">{icon}</span>
      )}
      <span className="file-chip-name">{file.name}</span>
      {!uploading && onRemove && (
        <button className="file-chip-remove" onClick={onRemove} title="Remove file">
          ✕
        </button>
      )}
    </div>
  );
}
