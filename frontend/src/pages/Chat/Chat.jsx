import { useEffect, useRef, useState } from "react";
import { socket } from "../../lib/socket";
import { useAuth } from "../../context/AuthContext";

import "./Chat.css";

import {
  getSidebar,
  getConversation,
} from "../../services/chat.service";

function Chat() {
  const { user: currentUser, onlineUsers } = useAuth();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Load chat sidebar
  useEffect(() => {
    const loadSidebar = async () => {
      try {
        const data = await getSidebar();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadSidebar();
  }, []);

  // Load conversation
  const handleSelectUser = async (user) => {
  setSelectedUser(user);

  // Clear unread badge immediately
  setUsers((prevUsers) =>
    prevUsers.map((u) =>
      u.id === user.id
        ? {
            ...u,
            unreadCount: 0,
          }
        : u
    )
  );

  try {
    const conversation = await getConversation(user.id);
    setMessages(conversation);

    socket.emit("mark-seen", {
      senderId: user.id,
    });
  } catch (error) {
    console.error(error);
  }
};

  // Receive messages in real time
useEffect(() => {
  const handleReceiveMessage = (message) => {
  const isCurrentConversation =
    selectedUser &&
    (
      (message.senderId === selectedUser.id &&
        message.receiverId === currentUser?.id) ||
      (message.senderId === currentUser?.id &&
        message.receiverId === selectedUser.id)
    );

  if (isCurrentConversation) {
    setMessages((prev) => [...prev, message]);
    setIsTyping(false);

    // If the current user received a message while this chat is open,
    // immediately mark it as seen.
    if (
      message.senderId === selectedUser.id &&
      message.receiverId === currentUser?.id
    ) {
      socket.emit("mark-seen", {
        senderId: message.senderId,
      });
    }
  }

  // Update sidebar preview and move conversation to the top
  setUsers((prevUsers) => {
  const updatedUsers = prevUsers.map((user) => {
    if (
      user.id === message.senderId ||
      user.id === message.receiverId
    ) {
      const isIncoming =
        message.senderId === user.id &&
        message.receiverId === currentUser?.id;

      const chatOpen =
        selectedUser?.id === user.id;

      return {
        ...user,
        lastMessage: message.message,
        lastMessageSenderId: message.senderId,
        lastMessageTime: message.createdAt,

        unreadCount: isIncoming
          ? chatOpen
            ? 0
            : (user.unreadCount || 0) + 1
          : user.unreadCount,
      };
    }

    return user;
  });

  updatedUsers.sort((a, b) => {
    if (!a.lastMessageTime) return 1;
    if (!b.lastMessageTime) return -1;

    return (
      new Date(b.lastMessageTime) -
      new Date(a.lastMessageTime)
    );
  });

  return updatedUsers;
});
};

  const handleTyping = ({ senderId }) => {
    if (selectedUser && senderId === selectedUser.id) {
      setIsTyping(true);
    }
  };

  const handleStopTyping = ({ senderId }) => {
  if (selectedUser && senderId === selectedUser.id) {
    setIsTyping(false);
  }
};

const handleMessagesSeen = ({ seenBy }) => {
  if (!selectedUser || selectedUser.id !== seenBy) return;

  setMessages((prev) =>
    prev.map((message) =>
      message.senderId === currentUser?.id
        ? { ...message, seen: true }
        : message
    )
  );
};

socket.on("receive-message", handleReceiveMessage);
socket.on("typing", handleTyping);
socket.on("stop-typing", handleStopTyping);
socket.on("messages-seen", handleMessagesSeen);

return () => {
  socket.off("receive-message", handleReceiveMessage);
  socket.off("typing", handleTyping);
  socket.off("stop-typing", handleStopTyping);
  socket.off("messages-seen", handleMessagesSeen);
};
}, [selectedUser, currentUser]);




  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleTyping = (value) => {
  setText(value);

  if (!selectedUser) return;

  socket.emit("typing", {
    receiverId: selectedUser.id,
  });

  clearTimeout(typingTimeoutRef.current);

  typingTimeoutRef.current = setTimeout(() => {
    socket.emit("stop-typing", {
      receiverId: selectedUser.id,
    });
  }, 1000);
};

  const handleSend = () => {
    if (!text.trim()) return;
    if (!selectedUser) return;

    socket.emit("send-message", {
      receiverId: selectedUser.id,
      message: text,
    });

    setText("");
  };

  return (
    <div className="chat-page">
      <aside className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h2>Chats</h2>
        </div>

        <div className="chat-users">
          {users.map((user) => (
            <div
              key={user.id}
              className={`chat-user ${
                selectedUser?.id === user.id ? "active" : ""
              }`}
              onClick={() => handleSelectUser(user)}
            >
              <div className="chat-user-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>

              <div className="chat-user-details">
                <div className="chat-user-top">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <h4>{user.username}</h4>

                        <span
                          className={
                            onlineUsers.includes(user.id)
                              ? "status-dot online"
                              : "status-dot offline"
                          }
                        />
                      </div>

                      {user.unreadCount > 0 && (
                        <span className="unread-badge">
                          {user.unreadCount}
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
              </div>
            </div>
          ))}
        </div>
      </aside>

      <section className="chat-window">
        <div className="chat-header">
  <div>
    <h3>
      {selectedUser
        ? selectedUser.username
        : "Select a user"}
    </h3>

    {selectedUser && isTyping && (
      <p className="typing-indicator">
        Typing...
      </p>
    )}
  </div>
</div>

        <div className="chat-messages">
          {!selectedUser ? (
            <p>Select a user to start chatting.</p>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${
                    message.senderId === currentUser?.id
                      ? "sent"
                      : "received"
                  }`}
                >
                  <div>{message.message}</div>

                  <small
  style={{
    display: "block",
    marginTop: "6px",
    fontSize: "11px",
    opacity: 0.7,
  }}
>
  {formatTime(message.createdAt)}

  {message.senderId === currentUser?.id && (
    <>
      {" • "}
      {message.seen ? "Seen" : "Sent"}
    </>
  )}
</small>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => handleTyping(e.target.value)}
            disabled={!selectedUser}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
          />

          <button
            onClick={handleSend}
            disabled={!selectedUser}
          >
            Send
          </button>
        </div>
      </section>
    </div>
  );
}

export default Chat;