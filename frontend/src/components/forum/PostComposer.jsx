import { useState } from "react";
import { createPost } from "../../services/forum.service";

function PostComposer({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || loading) return;

    try {
      setLoading(true);

      await createPost(content.trim());

      setContent("");
      setExpanded(false);

      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setContent("");
    setExpanded(false);
  };

  return (
    <div className={`post-composer ${expanded ? "expanded" : ""}`}>
      <textarea
        placeholder="💭 What's happening on your campus today?"
        value={content}
        rows={expanded ? 5 : 1}
        onFocus={() => setExpanded(true)}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="post-composer-footer">
        {expanded && (
          <button
            className="cancel-btn"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
        )}

        <button
          className="post-btn"
          onClick={handleSubmit}
          disabled={loading || !content.trim()}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}

export default PostComposer;