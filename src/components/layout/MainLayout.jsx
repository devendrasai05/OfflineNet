import Header from "../navigation/Header";
import Sidebar from "../navigation/Sidebar";

function MainLayout({ children }) {
  return (
    <div className="app-layout">
      <Header />

      <div className="app-body">
        <Sidebar />

        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;