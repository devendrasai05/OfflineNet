import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";

import { socket } from "../../lib/socket";
import { useAuth } from "../../context/AuthContext";

import WorkspaceLayout from "../../components/layout/WorkspaceLayout";

import toast from "react-hot-toast";

import "./Chat.css";

import {
  getConversation,
  getSidebar,
  editMessage,
  deleteMessage,
  uploadFile,
} from "../../services/chat.service";

import ChatSidebar from "./components/ChatSidebar.jsx";
import ChatHeader from "./components/ChatHeader";
import ReplyMessage from "./components/ReplyMessage";
import FileMessage from "./components/FileMessage";
import MessageMenu from "./components/MessageMenu";
import MessageBubble from "./components/MessageBubble";

const getFileIcon = (mimeType = "", fileName = "") => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (mimeType.startsWith("audio/")) return "🎵";
  if (mimeType.startsWith("video/")) return "🎬";
  if (mimeType.startsWith("image/")) return "🖼️";

  if (mimeType === "application/pdf" || extension === "pdf") return "📕";

  if (mimeType.includes("word") || ["doc", "docx"].includes(extension))
    return "📝";

  if (mimeType.includes("sheet") || ["xls", "xlsx", "csv"].includes(extension))
    return "📊";

  if (mimeType.includes("presentation") || ["ppt", "pptx"].includes(extension))
    return "📽️";

  if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) return "📦";

  if (
    [
      "js",
      "jsx",
      "ts",
      "tsx",
      "java",
      "cpp",
      "c",
      "py",
      "html",
      "css",
      "json",
    ].includes(extension)
  )
    return "💻";

  return "📄";
};

const formatFileSize = (bytes = 0) => {
  if (bytes < 1024) return `${bytes} B`;

  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;

  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;

  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
};

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
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const fileInputRef = useRef(null);

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
  if (!messagesContainerRef.current) return;

  messagesContainerRef.current.scrollTo({
    top: messagesContainerRef.current.scrollHeight,
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (!file || !selectedUser) return;

    try {
      // Upload the file to the backend
      const uploadedFile = await uploadFile(file);

      // Send it as a normal chat message
      socket.emit("send-message", {
        receiverId: selectedUser.id,
        message: "",
        messageType: "FILE",
        fileName: uploadedFile.fileName,
        filePath: uploadedFile.filePath,
        fileSize: uploadedFile.fileSize,
        mimeType: uploadedFile.mimeType,
        replyToId: replyingTo?.id ?? null,
      });

      setReplyingTo(null);

      // Allow selecting the same file again later
      event.target.value = "";
    } catch (error) {
      console.error(error);
      toast.error("File upload failed");
    }
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
  <WorkspaceLayout
    sidebar={
      <ChatSidebar
        users={users}
        selectedUser={selectedUser}
        currentUser={currentUser}
        onlineUsers={onlineUsers}
        onSelectUser={handleSelectUser}
      />
    }
    sidebarWidth="340px"
  >
    <section className="chat-window">
      <ChatHeader
        selectedUser={selectedUser}
        isTyping={isTyping}
        onlineUsers={onlineUsers}
      />

      <div
  ref={messagesContainerRef}
  className="chat-messages"
>
        {!selectedUser ? (
          <p>Select a user to start chatting.</p>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                currentUser={currentUser}
                selectedUser={selectedUser}
                editingMessageId={editingMessageId}
                editedText={editedText}
                setEditedText={setEditedText}
                handleSaveEdit={handleSaveEdit}
                handleCancelEdit={handleCancelEdit}
                getFileIcon={getFileIcon}
                formatFileSize={formatFileSize}
                formatTime={formatTime}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
                setReplyingTo={setReplyingTo}
                setEditingMessageId={setEditingMessageId}
                handleDeleteMessage={handleDeleteMessage}
              />
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
            className="chat-icon-button"
          >
            😊
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={!selectedUser}
            className="chat-icon-button"
          >
            📎
          </button>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleFileUpload}
          />

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
            style={{ flex: 1 }}
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
  </WorkspaceLayout>
);
}

export default Chat;
