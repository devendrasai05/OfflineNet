function ChatSidebar({
  users,
  selectedUser,
  currentUser,
  onlineUsers,
  onSelectUser,
}) {
  return (
    <aside className="chat-sidebar">
      <div className="chat-sidebar-header">
        <h2>💬 Conversations</h2>
        <p>Stay connected with OfflineNet</p>

        <input
          className="chat-search"
          type="text"
          placeholder="Search conversations..."
        />
      </div>

      <div className="chat-users">
        {users.map((user) => {
          const isOnline = onlineUsers.includes(user.id);

          return (
            <div
              key={user.id}
              className={`chat-user ${
                selectedUser?.id === user.id ? "active" : ""
              }`}
              onClick={() => onSelectUser(user)}
            >
              <div className="chat-user-avatar-wrapper">
                <div className="chat-user-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </div>

                <span
                  className={`status-dot ${isOnline ? "online" : "offline"}`}
                />
              </div>

              <div className="chat-user-details">
                <div className="chat-user-top">
                  <h4>{user.username}</h4>

                  {user.lastMessageTime && (
                    <span className="chat-user-time">
                      {new Date(user.lastMessageTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>

                <p className="chat-user-subtitle">
                  {user.lastMessage ? (
                    <>
                      {user.lastMessageSenderId === currentUser?.id && (
                        <strong>You: </strong>
                      )}
                      {user.lastMessage}
                    </>
                  ) : (
                    "No messages yet"
                  )}
                </p>

                <div className="chat-user-bottom">
                  <span
                    className={`chat-user-status ${
                      isOnline ? "online" : "offline"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>

                  {user.unreadCount > 0 && (
                    <span className="unread-badge">
                      {user.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="chat-sidebar-footer">
        <strong>OfflineNet Messenger</strong>
        <span>
          {users.length} Conversation{users.length !== 1 ? "s" : ""}
        </span>
      </div>
    </aside>
  );
}

export default ChatSidebar;