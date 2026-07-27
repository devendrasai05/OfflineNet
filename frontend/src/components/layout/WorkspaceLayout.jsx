import "./WorkspaceLayout.css";

function WorkspaceLayout({
  sidebar,
  children,
  sidebarWidth = "300px",
}) {
  return (
    <div className="workspace-layout">
      <aside
        className="workspace-sidebar"
        style={{ width: sidebarWidth }}
      >
        {sidebar}
      </aside>

      <section className="workspace-content">
        {children}
      </section>
    </div>
  );
}

export default WorkspaceLayout;