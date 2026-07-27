import { useEffect, useMemo, useState } from "react";

import WorkspaceLayout from "../../components/layout/WorkspaceLayout";
import FileSidebar from "../../components/files/FileSidebar";
import FileToolbar from "../../components/files/FileToolbar";
import UploadModal from "../../components/files/UploadModal";
import DocumentCard from "../../components/files/DocumentCard";
import FilePreviewModal from "../../components/files/FilePreviewModal";

import "../../styles/files.css";

import {
  getDocuments,
  uploadDocument,
} from "../../services/sharedDocument.service";

const categories = [
  "Notes",
  "Assignments",
  "Books",
  "Question Papers",
  "Others",
];

function Files() {
  const [documents, setDocuments] = useState([]);

  const [search, setSearch] = useState("");

  const [showUploadModal, setShowUploadModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Notes");
  const [file, setFile] = useState(null);

  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const loadDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("file", file);

      await uploadDocument(formData);

      setTitle("");
      setDescription("");
      setCategory("Notes");
      setFile(null);

      setShowUploadModal(false);

      await loadDocuments();

      alert("Document uploaded successfully.");
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    }
  };

  const openPreview = (document) => {
    setSelectedDocument(document);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setSelectedDocument(null);
  };

  const filteredDocuments = useMemo(() => {
    let filtered = [...documents];

    switch (activeFilter) {
      case "recent":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        filtered = filtered.slice(0, 10);
        break;

      case "documents":
        filtered = filtered.filter((doc) =>
          ["pdf", "doc", "docx", "txt", "ppt", "pptx", "xls", "xlsx"].includes(
            doc.fileName?.split(".").pop()?.toLowerCase(),
          ),
        );
        break;

      case "images":
        filtered = filtered.filter((doc) =>
          ["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(
            doc.fileName?.split(".").pop()?.toLowerCase(),
          ),
        );
        break;

      case "audio":
        filtered = filtered.filter((doc) =>
          ["mp3", "wav", "aac", "ogg", "flac"].includes(
            doc.fileName?.split(".").pop()?.toLowerCase(),
          ),
        );
        break;

      case "videos":
        filtered = filtered.filter((doc) =>
          ["mp4", "mkv", "avi", "mov", "webm"].includes(
            doc.fileName?.split(".").pop()?.toLowerCase(),
          ),
        );
        break;

      default:
        break;
    }

    const value = search.toLowerCase();

    return filtered.filter((doc) => {
      return (
        doc.title.toLowerCase().includes(value) ||
        doc.category.toLowerCase().includes(value) ||
        (doc.description || "").toLowerCase().includes(value)
      );
    });
  }, [documents, search, activeFilter]);

  return (
    <WorkspaceLayout
      sidebar={
        <FileSidebar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      }
      sidebarWidth="260px"
    >
      <div className="files-page">
        <div className="files-header">
          <div>
            <h1>Shared Documents</h1>

            <p>Share and manage documents across OfflineNet.</p>
          </div>
        </div>

        <FileToolbar
          search={search}
          setSearch={setSearch}
          onUploadClick={() => setShowUploadModal(true)}
        />

        <div className="documents-grid">
          {filteredDocuments.length === 0 ? (
            <div className="empty-documents">
              <h3>No documents found</h3>

              <p>Upload a document to get started.</p>
            </div>
          ) : (
            filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onClick={() => openPreview(document)}
              />
            ))
          )}
        </div>

        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          category={category}
          setCategory={setCategory}
          file={file}
          setFile={setFile}
          categories={categories}
          onSubmit={handleUpload}
        />
      </div>

      <FilePreviewModal
        isOpen={showPreview}
        onClose={closePreview}
        document={selectedDocument}
      />
    </WorkspaceLayout>
  );
}

export default Files;
