import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="app-header">
      <div className="header-logo">
        <h2>OfflineNet</h2>
      </div>

      <div className="header-actions">
        <span className="header-user">
          Welcome, {user?.name}
        </span>

        <Button onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}

export default Header;