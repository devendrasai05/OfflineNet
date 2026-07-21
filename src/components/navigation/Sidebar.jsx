import { NavLink } from "react-router-dom";

const menuItems = [
  { path: "/", label: "Dashboard" },
  { path: "/chat", label: "Chat" },
  { path: "/files", label: "Files" },
  { path: "/forum", label: "Forum" },
  { path: "/search", label: "Search" },
  { path: "/admin", label: "Admin" },
];

function Sidebar() {
  return (
    <aside className="app-sidebar">
      <nav>
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;