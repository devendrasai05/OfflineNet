import { useEffect, useMemo, useState } from "react";
import { FaFileAlt, FaSearch, FaUser, FaComments } from "react-icons/fa";

import { getPosts } from "../../services/forum.service";
import { getDocuments } from "../../services/sharedDocument.service";
import { getUsers } from "../../services/user.service";

import "./Search.css";

function Search() {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSearchData = async () => {
      try {
        setLoading(true);

        const [postsData, documentsData, usersData] = await Promise.all([
          getPosts(),
          getDocuments(),
          getUsers(),
        ]);

        setPosts(postsData || []);
        setDocuments(documentsData || []);
        setUsers(usersData || []);
      } catch (error) {
        console.error("Failed to load search data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSearchData();
  }, []);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) return [];

    return posts.filter((post) =>
      post.content?.toLowerCase().includes(normalizedQuery),
    );
  }, [posts, normalizedQuery]);

  const filteredDocuments = useMemo(() => {
    if (!normalizedQuery) return [];

    return documents.filter((document) => {
      return (
        document.title?.toLowerCase().includes(normalizedQuery) ||
        document.description?.toLowerCase().includes(normalizedQuery) ||
        document.fileName?.toLowerCase().includes(normalizedQuery) ||
        document.category?.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [documents, normalizedQuery]);

  const filteredUsers = useMemo(() => {
    if (!normalizedQuery) return [];

    return users.filter(
      (user) =>
        user.username?.toLowerCase().includes(normalizedQuery) ||
        user.email?.toLowerCase().includes(normalizedQuery),
    );
  }, [users, normalizedQuery]);

  const hasResults =
    filteredPosts.length > 0 ||
    filteredDocuments.length > 0 ||
    filteredUsers.length > 0;

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Search</h1>
        <p>Find users, forum posts, and shared documents.</p>
      </div>

      <div className="search-box">
        <FaSearch />
        <input
          type="text"
          placeholder="Search OfflineNet..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {loading ? (
        <div className="search-empty">
          <p>Loading search data...</p>
        </div>
      ) : !normalizedQuery ? (
        <div className="search-empty">
          <FaSearch />
          <p>Start typing to search OfflineNet.</p>
        </div>
      ) : !hasResults ? (
        <div className="search-empty">
          <FaSearch />
          <p>No results found for "{query}".</p>
        </div>
      ) : (
        <div className="search-results">
          {filteredUsers.length > 0 && (
            <section className="search-section">
              <div className="search-section-header">
                <FaUser />
                <h2>Users</h2>
                <span>{filteredUsers.length}</span>
              </div>

              <div className="search-result-list">
                {filteredUsers.map((user) => (
                  <div className="search-result-card" key={user.id}>
                    <div className="search-result-icon">
                      <FaUser />
                    </div>

                    <div>
                      <h3>{user.username}</h3>
                      <p>{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {filteredPosts.length > 0 && (
            <section className="search-section">
              <div className="search-section-header">
                <FaComments />
                <h2>Forum Posts</h2>
                <span>{filteredPosts.length}</span>
              </div>

              <div className="search-result-list">
                {filteredPosts.map((post) => (
                  <div className="search-result-card" key={post.id}>
                    <div className="search-result-icon">
                      <FaComments />
                    </div>

                    <div>
                      <h3>{post.author?.username || "Unknown user"}</h3>
                      <p>{post.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {filteredDocuments.length > 0 && (
            <section className="search-section">
              <div className="search-section-header">
                <FaFileAlt />
                <h2>Shared Documents</h2>
                <span>{filteredDocuments.length}</span>
              </div>

              <div className="search-result-list">
                {filteredDocuments.map((document) => (
                  <div className="search-result-card" key={document.id}>
                    <div className="search-result-icon">
                      <FaFileAlt />
                    </div>

                    <div>
                      <h3>{document.title || document.fileName}</h3>
                      <p>
                        {document.description ||
                          document.fileName ||
                          "Shared document"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;