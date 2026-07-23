import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getUsers = async () => {
  const token = localStorage.getItem("offlinenet-token");

  const response = await axios.get(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  

  return response.data.users;
}; 

export const getConversation = async (userId) => {
  const token = localStorage.getItem("offlinenet-token");

  const response = await axios.get(
    `${API_URL}/messages/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.messages;
};