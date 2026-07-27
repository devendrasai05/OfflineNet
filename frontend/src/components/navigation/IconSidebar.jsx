import { NavLink, useNavigate } from "react-router-dom";

import {
  FaGlobe,
  FaHome,
  FaComments,
  FaFolderOpen,
  FaUsers,
  FaSearch,
  FaUserShield,
  FaCog,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

const menuItems = [
  {
    path: "/",
    label: "Dashboard",
    icon: <FaHome />,
  },
  {
    path: "/chat",
    label: "Chat",
    icon: <FaComments />,
  },
  {
    path: "/files",
    label: "Files",
    icon: <FaFolderOpen />,
  },
  {
    path: "/forum",
    label: "Forum",
    icon: <FaUsers />,
  },
  {
    path: "/search",
    label: "Search",
    icon: <FaSearch />,
  },
  {
    path: "/admin",
    label: "Admin",
    icon: <FaUserShield />,
  },
];

function IconSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="icon-sidebar">
      <div className="icon-sidebar-top">
        <div className="app-logo" title="OfflineNet">
          <FaGlobe />
        </div>

        <nav className="icon-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              title={item.label}
              className={({ isActive }) =>
                isActive ? "icon-link active" : "icon-link"
              }
            >
              {item.icon}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="icon-sidebar-bottom">
        <div className="icon-divider" />

        <NavLink
          to="/settings"
          title="Settings"
          className={({ isActive }) =>
            isActive ? "icon-link active" : "icon-link"
          }
        >
          <FaCog />
        </NavLink>

        <button
          className="icon-link icon-button"
          title="Profile"
          type="button"
        >
          <FaUserCircle />
        </button>

        <button
          className="icon-link icon-button logout-button"
          title="Logout"
          type="button"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
        </button>
      </div>
    </aside>
  );
}

export default IconSidebar;