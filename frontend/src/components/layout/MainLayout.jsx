import { Outlet } from "react-router-dom";
import IconSidebar from "../navigation/IconSidebar";

function MainLayout() {
  return (
    <div className="desktop-layout">
      <IconSidebar />

      <main className="desktop-content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;