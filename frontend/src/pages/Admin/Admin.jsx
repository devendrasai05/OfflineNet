import { useEffect, useState } from "react";
import {
  FaComments,
  FaFileAlt,
  FaServer,
  FaUsers,
} from "react-icons/fa";

import "../../styles/admin.css";

const API_URL = "http://localhost:5000/api";

function Admin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const token = localStorage.getItem("offlinenet-token");

        const response = await fetch(`${API_URL}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load admin statistics");
        }

        const data = await response.json();

        setStats(data);
      } catch (error) {
        console.error("Admin stats error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage and monitor your OfflineNet platform.</p>
        </div>
      </div>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <FaUsers />
          </div>

          <div>
            <span>Total Users</span>
            <strong>{loading ? "..." : stats?.users ?? 0}</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <FaComments />
          </div>

          <div>
            <span>Total Messages</span>
            <strong>{loading ? "..." : stats?.messages ?? 0}</strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <FaFileAlt />
          </div>

          <div>
            <span>Shared Files</span>
            <strong>
              {loading ? "..." : stats?.sharedDocuments ?? 0}
            </strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <FaServer />
          </div>

          <div>
            <span>System Status</span>
            <strong>{loading ? "..." : stats?.systemStatus}</strong>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>System Overview</h2>
              <p>
                OfflineNet system information and administration tools.
              </p>
            </div>
          </div>

          <div className="admin-empty-state">
            <FaServer />
            <h3>Administration tools</h3>
            <p>
              User management and system statistics will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;