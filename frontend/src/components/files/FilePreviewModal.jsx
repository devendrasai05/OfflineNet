function formatFileSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return `${(
    bytes /
    (1024 * 1024 * 1024)
  ).toFixed(2)} GB`;
}

function FilePreviewModal({
  isOpen,
  onClose,
  document,
}) {
  if (!isOpen || !document) return null;

  const fileUrl = `http://localhost:5000/uploads/${document.filePath
    .split("\\")
    .pop()}`;

  const extension = document.fileName
    ?.split(".")
    .pop()
    ?.toLowerCase();

  const imageTypes = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "bmp",
  ];

  const pdfTypes = ["pdf"];

  const textTypes = ["txt"];

  return (
    <div
      className="preview-overlay"
      onClick={onClose}
    >
      <div
        className="preview-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="preview-header">
          <h2>{document.title}</h2>

          <button
            className="preview-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="preview-body">
          <div className="preview-viewer">
            {imageTypes.includes(extension) && (
              <img
                src={fileUrl}
                alt={document.title}
                className="preview-image"
              />
            )}

            {pdfTypes.includes(extension) && (
              <iframe
                src={fileUrl}
                title={document.title}
                className="preview-pdf"
              />
            )}

            {textTypes.includes(extension) && (
              <iframe
                src={fileUrl}
                title={document.title}
                className="preview-text"
              />
            )}

            {!imageTypes.includes(extension) &&
              !pdfTypes.includes(extension) &&
              !textTypes.includes(extension) && (
                <div className="preview-unavailable">
                  <h3>No Preview Available</h3>

                  <p>
                    This file type cannot be previewed.
                  </p>
                </div>
              )}
          </div>

          <aside className="preview-sidebar">
            <h3>File Details</h3>

            <div className="preview-info-card">
              <span>Type</span>
              <strong>
                {extension?.toUpperCase()}
              </strong>
            </div>

            <div className="preview-info-card">
              <span>Category</span>
              <strong>
                {document.category}
              </strong>
            </div>

            <div className="preview-info-card">
              <span>Uploaded By</span>
              <strong>
                {document.uploader.username}
              </strong>
            </div>

            <div className="preview-info-card">
              <span>Size</span>
              <strong>
                {formatFileSize(
                  document.fileSize
                )}
              </strong>
            </div>

            {document.createdAt && (
              <div className="preview-info-card">
                <span>Uploaded</span>
                <strong>
                  {new Date(
                    document.createdAt
                  ).toLocaleDateString()}
                </strong>
              </div>
            )}
          </aside>
        </div>

        <div className="preview-actions">
          <button
            className="cancel-button"
            onClick={onClose}
          >
            Close
          </button>

          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="download-button"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
}

export default FilePreviewModal;