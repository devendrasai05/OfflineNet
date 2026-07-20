import Header from "../navigation/Header";

function MainLayout({ children }) {
  return (
    <div className="app-layout">
      <Header />

      <div className="app-body">
        <aside className="app-sidebar">
          Sidebar
        </aside>

        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;