import toast from "react-hot-toast";

function MessageMenu({
  message,
  currentUser,
  openMenuId,
  setOpenMenuId,
  setReplyingTo,
  setEditingMessageId,
  setEditedText,
  handleDeleteMessage,
}) {
  return (
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

          <button
            onClick={() => {
              navigator.clipboard.writeText(message.message);
              toast.success("Message copied!");
              setOpenMenuId(null);
            }}
          >
            Copy
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
  );
}

export default MessageMenu;