import { FaComments, FaFolderOpen, FaUsers, FaSearch } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name} 👋</h1>
          <p>Welcome to OfflineNet.</p>
        </div>
      </div>

      <div className="dashboard-stats">
        <Card className="stat-card">
          <FaUsers className="stat-icon" />
          <h2>Online Users</h2>
          <h3>0</h3>
        </Card>

        <Card className="stat-card">
          <FaComments className="stat-icon" />
          <h2>Unread Messages</h2>
          <h3>0</h3>
        </Card>

        <Card className="stat-card">
          <FaFolderOpen className="stat-icon" />
          <h2>Shared Files</h2>
          <h3>0</h3>
        </Card>

        <Card className="stat-card">
          <FaSearch className="stat-icon" />
          <h2>Forum Posts</h2>
          <h3>0</h3>
        </Card>

      </div>

      <div className="dashboard-grid">
        <Card>
          <h2>Recent Activity</h2>

          <ul className="activity-list">
            <li>No recent activity.</li>
          </ul>
        </Card>

        <Card>
          <h2>Quick Actions</h2>

          <div className="quick-actions">
            <Button onClick={() => navigate("/chat")}>
              Open Chat
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate("/files")}
            >
              Shared Files
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate("/search")}
            >
              Search
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate("/forum")}
            >
              Forum
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;