import { socket } from "../../lib/socket";
import { useAuth } from "../../context/AuthContext";

import { useEffect, useRef, useState } from "react";
import "./Chat.css";

import {
  getUsers,
  getConversation,
} from "../../services/chat.service";







function Chat() {
  const {
  user: currentUser,
  onlineUsers,
} = useAuth();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  // Load all users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadUsers();
  }, []);

  // Load conversation when a user is selected
  const handleSelectUser = async (user) => {
    setSelectedUser(user);

    try {
      const conversation = await getConversation(user.id);
      setMessages(conversation);
    } catch (error) {
      console.error(error);
    }
  };

  // Receive messages in real time
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      if (
        selectedUser &&
        (
          (message.senderId === selectedUser.id &&
            message.receiverId === currentUser.id) ||
          (message.senderId === currentUser.id &&
            message.receiverId === selectedUser.id)
        )
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [selectedUser, currentUser]);

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
              <h4>{user.username}</h4>

              <p
                style={{
                  color: onlineUsers.includes(user.id)
                    ? "green"
                    : "gray",
                  fontSize: "13px",
                  margin: "4px 0",
                  fontWeight: "600",
                }}
              >
                {onlineUsers.includes(user.id)
                  ? "🟢 Online"
                  : "⚪ Offline"}
              </p>

              <p>{user.email}</p>
            </div>
          ))}
        </div>
      </aside>

      <section className="chat-window">
        <div className="chat-header">
          <h3>
            {selectedUser
              ? selectedUser.username
              : "Select a user"}
          </h3>
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
    message.senderId === currentUser.id
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
            onChange={(e) => setText(e.target.value)}
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