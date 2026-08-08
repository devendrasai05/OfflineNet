import axios from "axios";

import { API_URL } from "../config";

const getAuthHeaders = () => {
  const token = localStorage.getItem("offlinenet-token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`, {
    headers: getAuthHeaders(),
  });

  return response.data.users;
};

export const getSidebar = async () => {
  const response = await axios.get(`${API_URL}/messages/sidebar`, {
    headers: getAuthHeaders(),
  });

  return response.data.sidebar;
};

export const getConversation = async (userId) => {
  const response = await axios.get(`${API_URL}/messages/${userId}`, {
    headers: getAuthHeaders(),
  });

  return response.data.messages;
};

export const editMessage = async (messageId, message) => {
  const response = await axios.put(
    `${API_URL}/messages/${messageId}`,
    { message },
    {
      headers: getAuthHeaders(),
    },
  );

  return response.data.data;
};

export const deleteMessage = async (messageId) => {
  const response = await axios.delete(`${API_URL}/messages/${messageId}`, {
    headers: getAuthHeaders(),
  });

  return response.data.data;
};

export const uploadFile = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.file;
};