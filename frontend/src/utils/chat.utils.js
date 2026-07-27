export const getFileIcon = (mimeType = "", fileName = "") => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (mimeType.startsWith("audio/")) return "🎵";
  if (mimeType.startsWith("video/")) return "🎬";
  if (mimeType.startsWith("image/")) return "🖼️";

  if (mimeType === "application/pdf" || extension === "pdf") return "📕";

  if (mimeType.includes("word") || ["doc", "docx"].includes(extension))
    return "📝";

  if (mimeType.includes("sheet") || ["xls", "xlsx", "csv"].includes(extension))
    return "📊";

  if (mimeType.includes("presentation") || ["ppt", "pptx"].includes(extension))
    return "📽️";

  if (["zip", "rar", "7z", "tar", "gz"].includes(extension)) return "📦";

  if (
    [
      "js",
      "jsx",
      "ts",
      "tsx",
      "java",
      "cpp",
      "c",
      "py",
      "html",
      "css",
      "json",
    ].includes(extension)
  )
    return "💻";

  return "📄";
};

export const formatFileSize = (bytes = 0) => {
  if (bytes < 1024) return `${bytes} B`;

  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;

  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;

  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
};

export const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

