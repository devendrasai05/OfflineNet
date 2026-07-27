import {
  FaUser,
  FaPalette,
  FaBell,
  FaShieldAlt,
  FaInfoCircle,
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
      <h2 className="settings-title">Settings</h2>

      <div className="settings-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`settings-menu-item ${
              activeSection === item.id ? "active" : ""
            }`}
            onClick={() => setActiveSection(item.id)}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SettingsSidebar;