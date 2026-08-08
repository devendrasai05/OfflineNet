import {
  createComment,
  getComments,
  editComment,
  deleteComment,
} from "../services/comment.service.js";

export const addComment = async (req, res) => {
  try {
    const postId = Number(req.params.postId);
    const authorId = req.user.id;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty.",
      });
    }

    const comment = await createComment(
      postId,
      authorId,
      content.trim()
    );

    res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create comment.",
    });
  }
};

export const fetchComments = async (req, res) => {
  try {
    const postId = Number(req.params.postId);

    const comments = await getComments(postId);

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load comments.",
    });
  }
};

export const updateComment = async (req, res) => {
  try {
    const commentId = Number(req.params.commentId);
    const authorId = req.user.id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty.",
      });
    }

    const comment = await editComment(
      commentId,
      authorId,
      content.trim()
    );

    res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    console.error(error);

    if (
      error.message === "Comment not found" ||
      error.message === "Unauthorized"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update comment.",
    });
  }
};

export const removeComment = async (req, res) => {
  try {
    const commentId = Number(req.params.commentId);
    const authorId = req.user.id;

    await deleteComment(commentId, authorId);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    if (
      error.message === "Comment not found" ||
      error.message === "Unauthorized"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete comment.",
    });
  }
};