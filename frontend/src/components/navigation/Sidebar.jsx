import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaComments,
  FaFolderOpen,
  FaUsers,
  FaSearch,
  FaUserShield,
} from "react-icons/fa";

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

function Sidebar() {
  return (
    <aside className="app-sidebar">
      <nav>
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  isActive
                    ? "sidebar-link active"
                    : "sidebar-link"
                }
              >
                <span className="sidebar-icon">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;