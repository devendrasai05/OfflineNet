import {
  FaFolder,
  FaCloudUploadAlt,
  FaFileAlt,
  FaImage,
  FaMusic,
  FaVideo,
} from "react-icons/fa";

function FileSidebar({ activeFilter, onFilterChange }) {
  const items = [
    {
      id: "all",
      icon: <FaFolder />,
      label: "All Files",
    },
    {
      id: "upload",
      icon: <FaCloudUploadAlt />,
      label: "Upload",
    },
    {
      id: "documents",
      icon: <FaFileAlt />,
      label: "Documents",
    },
    {
      id: "images",
      icon: <FaImage />,
      label: "Images",
    },
    {
      id: "audio",
      icon: <FaMusic />,
      label: "Audio",
    },
    {
      id: "videos",
      icon: <FaVideo />,
      label: "Videos",
    },
  ];

  return (
    <div className="file-sidebar">
      <div className="file-sidebar-header">
        <div className="file-sidebar-icon">
          <FaFolder />
        </div>

        <div>
          <h2 className="file-sidebar-title">File Explorer</h2>

          <p className="file-sidebar-subtitle">Browse shared documents</p>
        </div>
      </div>

      <div className="file-sidebar-menu">
        {items.map((item) => (
          <button
            key={item.id}
            className={`file-sidebar-item ${
              activeFilter === item.id ? "active" : ""
            }`}
            onClick={() => onFilterChange(item.id)}
          >
            <span className="sidebar-item-icon">{item.icon}</span>

            <span className="sidebar-item-label">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default FileSidebar;
