function ReplyMessage({ replyTo, currentUser, selectedUser }) {
  if (!replyTo) return null;

  return (
    <div className="reply-message">
      <strong>
        ↩{" "}
        {replyTo.senderId === currentUser?.id
          ? "You"
          : selectedUser?.username}
      </strong>

      <p>
        {replyTo.deleted
          ? "This message was deleted."
          : replyTo.message}
      </p>
    </div>
  );
}

export default ReplyMessage;