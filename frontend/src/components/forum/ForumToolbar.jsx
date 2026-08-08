import { FaSearch } from "react-icons/fa";

function ForumToolbar({
  search,
  setSearch,
}) {
  return (
    <div className="forum-toolbar">
      <div className="forum-search">
        <FaSearch />

        <input
          type="text"
          placeholder="Search discussions..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>
    </div>
  );
}

export default ForumToolbar;