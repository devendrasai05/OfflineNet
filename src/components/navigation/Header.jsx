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
      <h2>OfflineNet</h2>

      <div className="header-actions">
        <span>Welcome, {user?.name}</span>

        <Button onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}

export default Header;