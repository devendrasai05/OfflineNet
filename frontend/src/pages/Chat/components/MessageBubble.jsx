import ReplyMessage from "./ReplyMessage";
import FileMessage from "./FileMessage";
import MessageMenu from "./MessageMenu";

function MessageBubble({
  message,
  currentUser,
  selectedUser,
  editingMessageId,
  editedText,
  setEditedText,
  handleSaveEdit,
  handleCancelEdit,
  getFileIcon,
  formatFileSize,
  formatTime,
  openMenuId,
  setOpenMenuId,
  setReplyingTo,
  setEditingMessageId,
  handleDeleteMessage,
}) {
  return (
    <div
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
            <ReplyMessage
              replyTo={message.replyTo}
              currentUser={currentUser}
              selectedUser={selectedUser}
            />

            <div>
              {message.messageType === "FILE" ? (
                <FileMessage
                  message={message}
                  getFileIcon={getFileIcon}
                  formatFileSize={formatFileSize}
                />
              ) : (
                <>
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
                </>
              )}
            </div>
          </span>
        )}

        <MessageMenu
          message={message}
          currentUser={currentUser}
          openMenuId={openMenuId}
          setOpenMenuId={setOpenMenuId}
          setReplyingTo={setReplyingTo}
          setEditingMessageId={setEditingMessageId}
          setEditedText={setEditedText}
          handleDeleteMessage={handleDeleteMessage}
        />
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
  );
}

export default MessageBubble;