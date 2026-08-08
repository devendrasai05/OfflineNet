import {
  createPost as createPostService,
  getPosts as getPostsService,
  toggleLike as toggleLikeService,
  editPost as editPostService,
  deletePost as deletePostService,
} from "../services/forum.service.js";

export const createPost = async (req, res) => {
  try {
    const authorId = req.user.id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post content cannot be empty",
      });
    }

    const post = await createPostService({
      authorId,
      content: content.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create post",
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await getPostsService();

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const userId = req.user.id;

    await deletePostService(postId, userId);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(error);

    if (
      error.message === "Post not found" ||
      error.message === "Unauthorized"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete post",
    });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const userId = req.user.id;

    const result = await toggleLikeService(postId, userId);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to toggle like",
    });
  }
};

export const editPost = async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const userId = req.user.id;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post content cannot be empty",
      });
    }

    const post = await editPostService(
      postId,
      userId,
      content.trim()
    );

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error(error);

    if (
      error.message === "Post not found" ||
      error.message === "Unauthorized"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to edit post",
    });
  }
};

export const addComment = async (req, res) => {};

export const searchPosts = async (req, res) => {};