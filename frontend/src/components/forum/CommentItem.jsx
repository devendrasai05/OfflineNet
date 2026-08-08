import { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
} from "react-icons/fa";

function CommentItem({
  comment,
  currentUser,
  onEditComment,
  onDeleteComment,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleSave = async () => {
    if (!editedContent.trim()) return;

    await onEditComment(comment.id, editedContent);

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <div>
          <strong>{comment.author.username}</strong>

          {comment.edited && (
            <span className="comment-time">
              {" "}
              • Edited
            </span>
          )}
        </div>

        {currentUser?.id === comment.authorId && (
          <div className="comment-actions">
            {isEditing ? (
              <>
                <button onClick={handleSave}>
                  <FaSave />
                </button>

                <button onClick={handleCancel}>
                  <FaTimes />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditing(true)}>
                  <FaEdit />
                </button>

                <button
                  className="delete"
                  onClick={() => onDeleteComment(comment.id)}
                >
                  <FaTrash />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) =>
            setEditedContent(e.target.value)
          }
          rows={3}
        />
      ) : (
        <p>{comment.content}</p>
      )}
    </div>
  );
}

export default CommentItem;