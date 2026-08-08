import { useState } from "react";
import { FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";

function UploadWorkspace({
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  file,
  setFile,
  categories,
  onSubmit,
}) {
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;
    setFile(droppedFile);

    if (!title.trim()) {
      const fileName = droppedFile.name.replace(/\.[^/.]+$/, "");
      setTitle(fileName);
    }
  };
  return (
    <div className="upload-workspace">
      <div className="upload-workspace-card">
        <div className="upload-workspace-header">
          <h2>Upload Document</h2>
          <p>Share documents with everyone on OfflineNet.</p>
        </div>

        <form className="upload-workspace-form" onSubmit={onSubmit}>
          <div className="upload-left">
            <label
              className={`upload-dropzone ${dragging ? "dragging" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                hidden
                onChange={(e) => {
                  const selectedFile = e.target.files[0];

                  if (!selectedFile) return;

                  setFile(selectedFile);

                  if (!title.trim()) {
                    const name = selectedFile.name.replace(/\.[^/.]+$/, "");
                    setTitle(name);
                  }
                }}
              />

              <FaCloudUploadAlt className="upload-icon" />

              <h3>Drag & Drop</h3>

              <p>or</p>

              <span className="browse-button">
                {file ? "Change File" : "Browse Files"}
              </span>

              {file && (
                <div className="selected-file">
                  <div className="selected-file-name">
                    <FaCheckCircle />
                    <span>{file.name}</span>
                  </div>
                  <small>
                    {file.size / 1024 < 1024
                      ? `${(file.size / 1024).toFixed(1)} KB`
                      : `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                  </small>
                </div>
              )}
            </label>
          </div>

          <div className="upload-right">
            <div className="form-group">
              <label>Title</label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter document title"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this document"
              />
            </div>

            <div className="form-group">
              <label>Category</label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <button className="upload-submit-btn" type="submit">
              Upload Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadWorkspace;
