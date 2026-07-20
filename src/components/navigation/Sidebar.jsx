import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="app-sidebar">
      <nav>
        <ul className="sidebar-menu">
          <li>
            <NavLink to="/">Dashboard</NavLink>
          </li>

          <li>
            <NavLink to="/chat">Chat</NavLink>
          </li>

          <li>
            <NavLink to="/files">Files</NavLink>
          </li>

          <li>
            <NavLink to="/forum">Forum</NavLink>
          </li>

          <li>
            <NavLink to="/search">Search</NavLink>
          </li>

          <li>
            <NavLink to="/admin">Admin</NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;