import { useEffect, useState } from "react";

import WorkspaceLayout from "../../components/layout/WorkspaceLayout";
import ForumSidebar from "../../components/forum/ForumSidebar";
import ForumToolbar from "../../components/forum/ForumToolbar";
import PostComposer from "../../components/forum/PostComposer";
import PostFeed from "../../components/forum/PostFeed";

import {
  getPosts,
  deletePost,
  toggleLike,
  editPost,
} from "../../services/forum.service";

import "../../styles/forum.css";

function Forum() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showComposer, setShowComposer] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("offlinenet-user"));

  const loadPosts = async () => {
    try {
      setLoading(true);

      const data = await getPosts();

      setPosts(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load forum posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId);

      await loadPosts();

      alert("Post deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to delete post.");
    }
  };

  const handleLike = async (postId) => {
    try {
      const result = await toggleLike(postId);

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id !== postId) return post;

          const updatedLikes = result.liked
            ? [...post.likes, { userId: currentUser.id }]
            : post.likes.filter((like) => like.userId !== currentUser.id);

          return {
            ...post,
            likes: updatedLikes,
            _count: {
              ...post._count,
              likes: result.liked
                ? post._count.likes + 1
                : post._count.likes - 1,
            },
          };
        }),
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update like.");
    }
  };

  const handleEdit = async (postId, content) => {
    try {
      const updatedPost = await editPost(postId, content);

      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === postId ? updatedPost : post)),
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update post.");
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    // Search filter
    const matchesSearch = post.content
      .toLowerCase()
      .includes(search.toLowerCase());

    if (!matchesSearch) return false;

    switch (activeFilter) {
      case "mine":
        return post.authorId === currentUser.id;

      case "liked":
        return post.likes.some((like) => like.userId === currentUser.id);

      case "recent":
        return true;

      case "all":
      default:
        return true;
    }
  });

  return (
    <WorkspaceLayout
      sidebar={
        <ForumSidebar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      }
      sidebarWidth="260px"
    >
      <div className="forum-page">
        <div className="forum-header">
          <div className="forum-header-title">
            <h1>Discussion Forum</h1>

            <p>Share updates and discussions with everyone on OfflineNet.</p>
          </div>

          <div className="forum-header-actions">
            <ForumToolbar search={search} setSearch={setSearch} />

            <button
              className="create-post-btn"
              onClick={() => setShowComposer((prev) => !prev)}
            >
              ✏️ Create Post
            </button>
          </div>
        </div>

        {showComposer && (
          <div className="forum-top-section">
            <PostComposer
              onPostCreated={() => {
                loadPosts();
                setShowComposer(false);
              }}
            />
          </div>
        )}

        <div className="forum-feed-section">
          {loading ? (
            <p>Loading posts...</p>
          ) : (
            <PostFeed
              posts={filteredPosts}
              currentUser={currentUser}
              onDelete={handleDelete}
              onLike={handleLike}
              onEdit={handleEdit}
            />
          )}
        </div>
      </div>
    </WorkspaceLayout>
  );
}

export default Forum;
