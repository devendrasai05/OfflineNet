import {
  FaBell,
  FaInfoCircle,
  FaPalette,
  FaShieldAlt,
  FaUser,
} from "react-icons/fa";

function SettingsSidebar({ activeSection, setActiveSection }) {
  const menuItems = [
    {
      id: "profile",
      label: "Profile",
      icon: <FaUser />,
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: <FaPalette />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <FaBell />,
    },
    {
      id: "privacy",
      label: "Privacy",
      icon: <FaShieldAlt />,
    },
    {
      id: "about",
      label: "About",
      icon: <FaInfoCircle />,
    },
  ];

  return (
    <div className="settings-sidebar">
      <div className="settings-sidebar-header">
        <h2>Settings</h2>
      </div>

      <div className="settings-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`settings-menu-item ${
              activeSection === item.id ? "active" : ""
            }`}
            onClick={() => setActiveSection(item.id)}
          >
            <span className="settings-menu-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SettingsSidebar;