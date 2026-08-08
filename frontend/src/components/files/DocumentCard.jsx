import {
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaFileAudio,
  FaFileVideo,
  FaFileAlt,
  FaDownload,
  FaUser,
  FaTag,
} from "react-icons/fa";

import { SERVER_URL } from "../../config";

function getFileIcon(fileName = "") {
  const ext = fileName.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "pdf":
      return <FaFilePdf className="pdf-icon" />;

    case "doc":
    case "docx":
      return <FaFileWord className="word-icon" />;

    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
      return <FaFileImage className="image-icon" />;

    case "mp3":
    case "wav":
    case "aac":
      return <FaFileAudio className="audio-icon" />;

    case "mp4":
    case "avi":
    case "mkv":
    case "mov":
      return <FaFileVideo className="video-icon" />;

    default:
      return <FaFileAlt className="default-icon" />;
  }
}

function formatSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function DocumentCard({ document, onClick }) {
  const fileUrl = `${SERVER_URL}/uploads/${document.filePath
    .split("\\")
    .pop()}`;

  return (
    <div className="document-card" onClick={onClick}>
      <div className="document-top">
        <div className="document-icon">{getFileIcon(document.fileName)}</div>

        <div className="document-title">
          <h3>{document.title}</h3>

          <p>{document.description || "No description provided"}</p>
        </div>
      </div>

      <div className="document-tags">
        <span className="category-badge">
          <FaTag />
          {document.category}
        </span>

        <span className="uploader">
          <FaUser />
          {document.uploader.username}
        </span>
      </div>

      <div className="document-footer">
        <span className="file-size">{formatSize(document.fileSize)}</span>

        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className="download-button"
          onClick={(e) => e.stopPropagation()}
        >
          <FaDownload />
          Download
        </a>
      </div>
    </div>
  );
}

export default DocumentCard;
