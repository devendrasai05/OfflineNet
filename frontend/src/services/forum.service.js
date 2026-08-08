import axios from "axios";

const API_URL = "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("offlinenet-token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getPosts = async () => {
  const response = await axios.get(
    `${API_URL}/forum`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.posts;
};

export const createPost = async (content) => {
  const response = await axios.post(
    `${API_URL}/forum`,
    { content },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.data;
};

export const deletePost = async (id) => {
  await axios.delete(
    `${API_URL}/forum/${id}`,
    {
      headers: getAuthHeaders(),
    }
  );
};

export const toggleLike = async (postId) => {
  const response = await axios.post(
    `${API_URL}/forum/${postId}/like`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const editPost = async (id, content) => {
  const response = await axios.put(
    `${API_URL}/forum/${id}`,
    {
      content,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.post;
};

export const editComment = async (commentId, content) => {
  const response = await axios.put(
    `${API_URL}/comments/${commentId}`,
    {
      content,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.comment;
};

export const deleteComment = async (commentId) => {
  await axios.delete(
    `${API_URL}/comments/${commentId}`,
    {
      headers: getAuthHeaders(),
    }
  );
};

export const getComments = async (postId) => {
  const response = await axios.get(
    `${API_URL}/comments/${postId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.comments;
};

export const addComment = async (postId, content) => {
  const response = await axios.post(
    `${API_URL}/comments/${postId}`,
    {
      content,
    },
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.comment;
};