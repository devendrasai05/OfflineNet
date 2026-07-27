import { FaSearch, FaUpload } from "react-icons/fa";

function FileToolbar({
  search,
  setSearch,
  onUploadClick,
}) {
  return (
    <div className="file-toolbar">
      <div className="file-search">
        <FaSearch />

        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      <button
        className="upload-button"
        onClick={onUploadClick}
      >
        <FaUpload />
        <span>Upload Document</span>
      </button>
    </div>
  );
}

export default FileToolbar;