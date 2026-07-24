import axios from "axios";

const API_URL = "http://localhost:5000/api";

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
  const response = await axios.get(
    `${API_URL}/messages/sidebar`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.sidebar;
};

export const getConversation = async (userId) => {
  const response = await axios.get(
    `${API_URL}/messages/${userId}`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data.messages;
};