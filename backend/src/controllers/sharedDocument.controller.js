import {
  uploadSharedDocument,
  getAllSharedDocuments,
} from "../services/sharedDocument.service.js";

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    const document = await uploadSharedDocument({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,

      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,

      uploaderId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully.",
      document,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to upload document.",
    });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const documents = await getAllSharedDocuments();

    res.json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch documents.",
    });
  }
};