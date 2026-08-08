function FileMessage({
  message,
  getFileIcon,
  formatFileSize,
}) {
  const fileUrl = `http://localhost:5000${message.filePath}`;

  if (message.mimeType?.startsWith("image/")) {
    return (
      <div className="image-message">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="chat-image"
            src={fileUrl}
            alt={message.fileName}
          />
        </a>

        <div className="chat-image-info">
          <span className="chat-image-name">
            {message.fileName}
          </span>

          <span className="chat-image-size">
            {formatFileSize(message.fileSize)}
          </span>

          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="file-download-button"
          >
            Download
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="file-message">
      <div className="file-icon">
        {getFileIcon(message.mimeType, message.fileName)}
      </div>

      <div className="file-details">
        <div className="file-name">
          {message.fileName}
        </div>

        <div className="file-type">
          {message.mimeType.split("/")[1]?.toUpperCase() || "FILE"}
        </div>

        <div className="file-size">
          {formatFileSize(message.fileSize)}
        </div>

        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="file-download-button"
        >
          ⬇ Download
        </a>
      </div>
    </div>
  );
}

export default FileMessage;