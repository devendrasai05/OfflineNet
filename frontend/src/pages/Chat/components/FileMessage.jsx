function FileMessage({
  message,
  getFileIcon,
  formatFileSize,
}) {
  if (message.mimeType?.startsWith("image/")) {
    return (
      <div>
        <a
          href={`http://localhost:5000${message.filePath}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={`http://localhost:5000${message.filePath}`}
            alt={message.fileName}
            style={{
              maxWidth: "250px",
              maxHeight: "250px",
              borderRadius: "8px",
              marginBottom: "8px",
              cursor: "pointer",
            }}
          />
        </a>

        <div
          style={{
            fontSize: "13px",
            opacity: 0.8,
          }}
        >
          🖼 {message.fileName}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "10px",
        padding: "12px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "rgba(255,255,255,0.05)",
        maxWidth: "320px",
      }}
    >
      <div style={{ fontSize: "32px" }}>
        {getFileIcon(message.mimeType, message.fileName)}
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontWeight: "600",
            wordBreak: "break-word",
          }}
        >
          {message.fileName}
        </div>

        <div
          style={{
            fontSize: "12px",
            opacity: 0.7,
            marginTop: "4px",
          }}
        >
          {message.mimeType}
        </div>

        <div
          style={{
            fontSize: "12px",
            opacity: 0.7,
          }}
        >
          {formatFileSize(message.fileSize)}
        </div>
      </div>

      <a
        href={`http://localhost:5000${message.filePath}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textDecoration: "none",
          fontSize: "22px",
        }}
        title="Download"
      >
        ⬇
      </a>
    </div>
  );
}

export default FileMessage;