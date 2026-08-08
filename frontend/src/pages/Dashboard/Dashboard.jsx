import { useEffect, useMemo, useState } from "react";
import {
  FaComments,
  FaFolderOpen,
  FaUsers,
  FaSearch,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import { useNavigate } from "react-router-dom";

import { socket } from "../../lib/socket";
import { getSidebar } from "../../services/chat.service";
import { getDocuments } from "../../services/sharedDocument.service";
import { getPosts } from "../../services/forum.service";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [onlineUsers, setOnlineUsers] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [sharedFiles, setSharedFiles] = useState(0);
  const [forumPosts, setForumPosts] = useState(0);

  const [posts, setPosts] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [sidebarConversations, setSidebarConversations] = useState([]);

  useEffect(() => {
    const handleOnlineUsers = (users) => {
      setOnlineUsers(users?.length || 0);
    };

    socket.on("online-users", handleOnlineUsers);

    return () => {
      socket.off("online-users", handleOnlineUsers);
    };
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [sidebar, documentsData, postsData] = await Promise.all([
          getSidebar(),
          getDocuments(),
          getPosts(),
        ]);

        const conversations = sidebar || [];
        const sharedDocuments = documentsData || [];
        const forumData = postsData || [];

        setSidebarConversations(conversations);
        setDocuments(sharedDocuments);
        setPosts(forumData);

        const totalUnread = conversations.reduce(
          (total, conversation) =>
            total + (conversation.unreadCount || 0),
          0,
        );

        setUnreadMessages(totalUnread);
        setSharedFiles(sharedDocuments.length);
        setForumPosts(forumData.length);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    loadDashboardData();
  }, []);

  const recentActivity = useMemo(() => {
    const activities = [];

    posts.slice(0, 5).forEach((post) => {
      activities.push({
        id: `post-${post.id}`,
        text: `${post.author?.username || "Someone"} created a forum post`,
        time: new Date(post.createdAt),
      });
    });

    documents.slice(0, 5).forEach((document) => {
      activities.push({
        id: `document-${document.id}`,
        text: `${document.uploader?.username || "Someone"} shared a document`,
        time: new Date(document.createdAt),
      });
    });

    sidebarConversations.forEach((conversation) => {
      if (conversation.lastMessageTime) {
        activities.push({
          id: `message-${conversation.id}`,
          text: `Message activity with ${conversation.username}`,
          time: new Date(conversation.lastMessageTime),
        });
      }
    });

    return activities
      .sort((a, b) => b.time - a.time)
      .slice(0, 5);
  }, [posts, documents, sidebarConversations]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.username} 👋</h1>
        <p>Welcome to OfflineNet.</p>
      </div>

      <div className="dashboard-stats">
        <Card className="stat-card">
          <FaUsers className="stat-icon" />
          <h2>Online Users</h2>
          <h3>{onlineUsers}</h3>
        </Card>

        <Card className="stat-card">
          <FaComments className="stat-icon" />
          <h2>Unread Messages</h2>
          <h3>{unreadMessages}</h3>
        </Card>

        <Card className="stat-card">
          <FaFolderOpen className="stat-icon" />
          <h2>Shared Files</h2>
          <h3>{sharedFiles}</h3>
        </Card>

        <Card className="stat-card">
          <FaSearch className="stat-icon" />
          <h2>Forum Posts</h2>
          <h3>{forumPosts}</h3>
        </Card>
      </div>

      <div className="dashboard-grid">
        <Card>
          <h2>Recent Activity</h2>

          {recentActivity.length === 0 ? (
            <ul className="activity-list">
              <li>No recent activity.</li>
            </ul>
          ) : (
            <ul className="activity-list">
              {recentActivity.map((activity) => (
                <li key={activity.id}>{activity.text}</li>
              ))}
            </ul>
          )}
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