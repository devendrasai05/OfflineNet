import { FaPhoneAlt, FaVideo, FaEllipsisV } from "react-icons/fa";

function ChatHeader({ selectedUser, isTyping, onlineUsers }) {
  const isOnline =
    selectedUser && onlineUsers.includes(selectedUser.id);

  if (!selectedUser) {
    return (
      <header className="chat-header">
        <div className="chat-header-empty">
          <h3>No conversation selected</h3>
          <p>Select a conversation from the sidebar.</p>
        </div>
      </header>
    );
  }

  return (
    <header className="chat-header">
      <div className="chat-header-left">
        <div className="chat-header-avatar-wrapper">
          <div className="chat-header-avatar">
            {selectedUser.username.charAt(0).toUpperCase()}
          </div>

          <span
            className={`chat-header-status-dot ${
              isOnline ? "online" : "offline"
            }`}
          />
        </div>

        <div className="chat-header-info">
          <h3>{selectedUser.username}</h3>

          <p className="chat-header-status">
            {isTyping
              ? "Typing..."
              : isOnline
              ? "Online"
              : "Offline"}
          </p>
        </div>
      </div>

      <div className="chat-header-actions">
        <button className="icon-button" disabled title="Voice Call (Coming Soon)">
          <FaPhoneAlt />
        </button>

        <button className="icon-button" disabled title="Video Call (Coming Soon)">
          <FaVideo />
        </button>

        <button className="icon-button" title="More Options">
          <FaEllipsisV />
        </button>
      </div>
    </header>
  );
}

export default ChatHeader;