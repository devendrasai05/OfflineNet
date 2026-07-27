import {
  FaFolder,
  FaClock,
  FaFileAlt,
  FaImage,
  FaMusic,
  FaVideo,
} from "react-icons/fa";

function FileSidebar({
  activeFilter,
  onFilterChange,
}) {
  const items = [
    {
      id: "all",
      icon: <FaFolder />,
      label: "All Files",
    },
    {
      id: "recent",
      icon: <FaClock />,
      label: "Recent",
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
      <h2 className="file-sidebar-title">
        File Explorer
      </h2>

      <div className="file-sidebar-menu">
        {items.map((item) => (
          <button
            key={item.id}
            className={`file-sidebar-item ${
              activeFilter === item.id
                ? "active"
                : ""
            }`}
            onClick={() =>
              onFilterChange(item.id)
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default FileSidebar;