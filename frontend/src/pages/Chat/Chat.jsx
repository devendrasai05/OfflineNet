import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";

import { socket } from "../../lib/socket";
import { useAuth } from "../../context/AuthContext";

import "./Chat.css";

import {
  getConversation,
  getSidebar,
  editMessage,
  deleteMessage,
} from "../../services/chat.service";

function Chat() {
  const { user: currentUser, onlineUsers } = useAuth();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const [openMenuId, setOpenMenuId] = useState(null);

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
          : u,
      ),
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
        ((message.senderId === selectedUser.id &&
          message.receiverId === currentUser?.id) ||
          (message.senderId === currentUser?.id &&
            message.receiverId === selectedUser.id));

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
          if (user.id === message.senderId || user.id === message.receiverId) {
            const isIncoming =
              message.senderId === user.id &&
              message.receiverId === currentUser?.id;

            const chatOpen = selectedUser?.id === user.id;

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

          return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
        });

        return updatedUsers;
      });
    };

    const handleTypingEvent = ({ senderId }) => {
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
            : message,
        ),
      );
    };

    const handleMessageEdited = (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === updatedMessage.id ? updatedMessage : msg,
        ),
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (
            user.id === updatedMessage.senderId ||
            user.id === updatedMessage.receiverId
          ) {
            return {
              ...user,
              lastMessage: updatedMessage.message,
            };
          }

          return user;
        }),
      );
    };

    const handleMessageDeleted = (deletedMessage) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === deletedMessage.id ? deletedMessage : msg,
        ),
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (
            user.id === deletedMessage.senderId ||
            user.id === deletedMessage.receiverId
          ) {
            return {
              ...user,
              lastMessage: deletedMessage.message,
            };
          }

          return user;
        }),
      );
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("typing", handleTypingEvent);
    socket.on("stop-typing", handleStopTyping);
    socket.on("messages-seen", handleMessagesSeen);
    socket.on("message-edited", handleMessageEdited);
    socket.on("message-deleted", handleMessageDeleted);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("typing", handleTypingEvent);
      socket.off("stop-typing", handleStopTyping);
      socket.off("messages-seen", handleMessagesSeen);
      socket.off("message-edited", handleMessageEdited);
      socket.off("message-deleted", handleMessageDeleted);
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

  const handleInputChange = (value) => {
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
      replyToId: replyingTo?.id ?? null,
    });

    setText("");
    setReplyingTo(null);
  };

  const handleSaveEdit = async () => {
    if (!editedText.trim()) return;

    try {
      const updatedMessage = await editMessage(
        editingMessageId,
        editedText.trim(),
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === updatedMessage.id ? updatedMessage : msg,
        ),
      );

      setEditingMessageId(null);
      setEditedText("");
    } catch (error) {
      console.error("Failed to edit message:", error);
      alert("Failed to edit message");
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedText("");
  };

  const handleDeleteMessage = async (messageId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?",
    );

    if (!confirmed) return;

    try {
      const deletedMessage = await deleteMessage(messageId);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === deletedMessage.id ? deletedMessage : msg,
        ),
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (
            user.id === deletedMessage.senderId ||
            user.id === deletedMessage.receiverId
          ) {
            return {
              ...user,
              lastMessage: deletedMessage.message,
            };
          }

          return user;
        }),
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete message.");
    }
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
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
                    <span className="unread-badge">{user.unreadCount}</span>
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
            <h3>{selectedUser ? selectedUser.username : "Select a user"}</h3>

            {selectedUser && isTyping && (
              <p className="typing-indicator">Typing...</p>
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
                    message.senderId === currentUser?.id ? "sent" : "received"
                  }`}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                    }}
                  >
                    {editingMessageId === message.id ? (
                      <input
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSaveEdit();
                          }

                          if (e.key === "Escape") {
                            handleCancelEdit();
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: "6px",
                        }}
                      />
                    ) : (
                      <span>
                        {message.replyTo && (
                          <div className="reply-message">
                            <strong>
                              ↩{" "}
                              {message.replyTo.senderId === currentUser?.id
                                ? "You"
                                : selectedUser?.username}
                            </strong>

                            <p>
                              {message.replyTo.deleted
                                ? "This message was deleted."
                                : message.replyTo.message}
                            </p>
                          </div>
                        )}

                        <div>
                          {message.message}

                          {message.edited && (
                            <span
                              style={{
                                marginLeft: "6px",
                                fontSize: "11px",
                                opacity: 0.7,
                                fontStyle: "italic",
                              }}
                            >
                              (edited)
                            </span>
                          )}
                        </div>
                      </span>
                    )}

                    <div className="message-actions">
                      <button
                        className="message-menu-button"
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === message.id ? null : message.id,
                          )
                        }
                      >
                        ⋮
                      </button>

                      {openMenuId === message.id && (
                        <div className="message-dropdown">
                          <button
                            onClick={() => {
                              setReplyingTo(message);
                              setOpenMenuId(null);
                            }}
                          >
                            Reply
                          </button>

                          {message.senderId === currentUser?.id &&
                            !message.deleted && (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingMessageId(message.id);
                                    setEditedText(message.message);
                                    setOpenMenuId(null);
                                  }}
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() => {
                                    handleDeleteMessage(message.id);
                                    setOpenMenuId(null);
                                  }}
                                >
                                  Delete
                                </button>
                              </>
                            )}
                        </div>
                      )}
                    </div>
                  </div>

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
          {replyingTo && (
            <div className="reply-preview">
              <div className="reply-preview-content">
                <strong>Replying to</strong>
                <p>{replyingTo.message}</p>
              </div>

              <button
                className="reply-cancel"
                onClick={() => setReplyingTo(null)}
              >
                ✕
              </button>
            </div>
          )}

          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              flex: 1,
            }}
          >
            <button
              ref={emojiButtonRef}
              type="button"
              onClick={toggleEmojiPicker}
              disabled={!selectedUser}
              style={{
                marginRight: "8px",
                fontSize: "20px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              😊
            </button>

            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                style={{
                  position: "absolute",
                  bottom: "55px",
                  left: "0",
                  zIndex: 1000,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                }}
              >
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  width={320}
                  height={400}
                />
              </div>
            )}

            <input
              type="text"
              placeholder={
                editingMessageId !== null
                  ? "Editing message... Press Enter to save, Esc to cancel"
                  : "Type a message..."
              }
              value={text}
              onChange={(e) => handleInputChange(e.target.value)}
              disabled={!selectedUser || editingMessageId !== null}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              style={{
                flex: 1,
              }}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!selectedUser || editingMessageId !== null}
          >
            Send
          </button>
        </div>
      </section>
    </div>
  );
}

export default Chat;
