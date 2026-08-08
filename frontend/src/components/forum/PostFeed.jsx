import PostCard from "./PostCard";

function PostFeed({
  posts,
  currentUser,
  onDelete,
  onLike,
  onEdit,
}) {
  if (!posts.length) {
    return (
      <div className="empty-feed">
        <h3>No posts yet</h3>

        <p>Be the first to start the discussion.</p>
      </div>
    );
  }

  return (
    <div className="post-feed">
      {posts.map((post) => (
        <PostCard
  key={post.id}
  post={post}
  currentUser={currentUser}
  onDelete={onDelete}
  onLike={onLike}
  onEdit={onEdit}
/>
      ))}
    </div>
  );
}

export default PostFeed;
