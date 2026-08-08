import {
  FaComments,
  FaClock,
  FaUser,
  FaHeart,
} from "react-icons/fa";

function ForumSidebar({
  activeFilter,
  onFilterChange,
}) {
  const items = [
    {
      id: "all",
      label: "All Posts",
      icon: <FaComments />,
    },
    {
      id: "recent",
      label: "Recent",
      icon: <FaClock />,
    },
    {
      id: "mine",
      label: "My Posts",
      icon: <FaUser />,
    },
    {
      id: "liked",
      label: "Liked Posts",
      icon: <FaHeart />,
    },
  ];

  return (
    <div className="forum-sidebar">
      <div className="forum-sidebar-header">
        <div className="forum-sidebar-icon">
          <FaComments />
        </div>

        <div>
          <h2 className="forum-sidebar-title">
            Discussion
          </h2>

          <p className="forum-sidebar-subtitle">
            Campus Community
          </p>
        </div>
      </div>

      <div className="forum-sidebar-menu">
        {items.map((item) => (
          <button
            key={item.id}
            className={`forum-sidebar-item ${
              activeFilter === item.id ? "active" : ""
            }`}
            onClick={() => onFilterChange(item.id)}
          >
            <span className="sidebar-item-icon">
              {item.icon}
            </span>

            <span className="sidebar-item-label">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ForumSidebar;