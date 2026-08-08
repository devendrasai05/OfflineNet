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
  const isMine = message.senderId === currentUser?.id;

  return (
    <div className={`message ${isMine ? "sent" : "received"}`}>
      <div className="message-content">
        {editingMessageId === message.id ? (
          <input
            className="message-edit-input"
            type="text"
            value={editedText}
            autoFocus
            onChange={(e) => setEditedText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSaveEdit();
              }

              if (e.key === "Escape") {
                handleCancelEdit();
              }
            }}
          />
        ) : (
          <div className="message-body">
            <ReplyMessage
              replyTo={message.replyTo}
              currentUser={currentUser}
              selectedUser={selectedUser}
            />

            {message.messageType === "FILE" ? (
              <FileMessage
                message={message}
                getFileIcon={getFileIcon}
                formatFileSize={formatFileSize}
              />
            ) : (
              <p className="message-text">
                {message.message}

                {message.edited && (
                  <span className="message-edited">
                    (edited)
                  </span>
                )}
              </p>
            )}
          </div>
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

      <div className="message-footer">
        <span>{formatTime(message.createdAt)}</span>

        {isMine && (
          <span>{message.seen ? "Seen" : "Sent"}</span>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;