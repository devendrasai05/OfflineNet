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
        <h2>Conversations</h2>

        <input
          className="chat-search"
          type="text"
          placeholder="Search chats..."
        />
      </div>

      <div className="chat-users">
        {users.map((user) => (
          <div
            key={user.id}
            className={`chat-user ${
              selectedUser?.id === user.id ? "active" : ""
            }`}
            onClick={() => onSelectUser(user)}
          >
            <div className="chat-user-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>

            <div className="chat-user-details">
              <div className="chat-user-top">
                <h4>{user.username}</h4>

                {user.unreadCount > 0 && (
                  <span className="unread-badge">
                    {user.unreadCount}
                  </span>
                )}
              </div>

              <div className="chat-user-status">
                <span
                  className={
                    onlineUsers.includes(user.id)
                      ? "status-dot online"
                      : "status-dot offline"
                  }
                />

                <span>
                  {onlineUsers.includes(user.id)
                    ? "Online"
                    : "Offline"}
                </span>
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
            </div>
          </div>
        ))}
      </div>

      <div className="chat-sidebar-footer">
        {users.length} conversation{users.length !== 1 ? "s" : ""}
      </div>
    </aside>
  );
}

export default ChatSidebar;