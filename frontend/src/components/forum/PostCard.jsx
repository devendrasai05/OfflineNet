import { useState } from "react";
import {
  FaEdit,
  FaHeart,
  FaRegCommentDots,
  FaSave,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

import CommentItem from "./CommentItem";

import {
  addComment,
  deleteComment,
  editComment,
  getComments,
} from "../../services/forum.service";

function getRelativeTime(date) {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000,
  );

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";

  return `${days} days ago`;
}

function PostCard({ post, currentUser, onDelete, onLike, onEdit }) {
  const initials = post.author.username.substring(0, 2).toUpperCase();

  const hasLiked = post.likes?.some(
    (like) => like.userId === currentUser?.id,
  );

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);

  const loadComments = async () => {
    try {
      setLoadingComments(true);

      const data = await getComments(post.id);

      setComments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleToggleComments = async () => {
    if (!showComments && comments.length === 0) {
      await loadComments();
    }

    setShowComments((prev) => !prev);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const comment = await addComment(post.id, commentText);

      setComments((prev) => [...prev, comment]);
      setCommentText("");
    } catch (error) {
      console.error(error);
      alert("Failed to add comment.");
    }
  };

  const handleEditComment = async (commentId, content) => {
    try {
      const updatedComment = await editComment(commentId, content);

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? updatedComment : comment,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);

      setComments((prev) =>
        prev.filter((comment) => comment.id !== commentId),
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete comment.");
    }
  };

  const handleSaveEdit = async () => {
    if (!editedContent.trim()) return;

    try {
      await onEdit(post.id, editedContent);

      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelEdit = () => {
    setEditedContent(post.content);
    setIsEditing(false);
  };

  return (
    <div className="post-card">
      <div className="post-card-header">
        <div className="post-avatar">{initials}</div>

        <div className="post-user">
          <h3>{post.author.username}</h3>

          <span>
            {getRelativeTime(post.createdAt)}

            {new Date(post.updatedAt).getTime() >
              new Date(post.createdAt).getTime() && <> • Edited</>}
          </span>
        </div>
      </div>

      <div className="post-content">
        {isEditing ? (
          <textarea
            className="edit-post-textarea"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={4}
          />
        ) : (
          <p>{post.content}</p>
        )}
      </div>

      <div className="post-card-footer">
        <div
          className={`post-action ${hasLiked ? "liked" : ""}`}
          onClick={() => onLike(post.id)}
        >
          <FaHeart />
          <span>{post._count.likes} Likes</span>
        </div>

        <div className="post-action" onClick={handleToggleComments}>
          <FaRegCommentDots />
          <span>
            {comments.length || post._count.comments} Comments
          </span>
        </div>

        {currentUser?.id === post.authorId && (
          <>
            {isEditing ? (
              <>
                <div className="post-action" onClick={handleSaveEdit}>
                  <FaSave />
                  <span>Save</span>
                </div>

                <div className="post-action" onClick={handleCancelEdit}>
                  <FaTimes />
                  <span>Cancel</span>
                </div>
              </>
            ) : (
              <>
                <div
                  className="post-action"
                  onClick={() => setIsEditing(true)}
                >
                  <FaEdit />
                  <span>Edit</span>
                </div>

                <div
                  className="post-action delete"
                  onClick={() => onDelete(post.id)}
                >
                  <FaTrash />
                  <span>Delete</span>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {showComments && (
        <div className="post-comments">
          <div className="comment-input">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddComment();
                }
              }}
            />

            <button onClick={handleAddComment}>Post</button>
          </div>

          {loadingComments ? (
            <p>Loading comments...</p>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUser={currentUser}
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteComment}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default PostCard;