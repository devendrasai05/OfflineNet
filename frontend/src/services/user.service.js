import axios from "axios";

import { API_URL } from "../config";

const USERS_API_URL = `${API_URL}/users`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("offlinenet-token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getUsers = async () => {
  const response = await axios.get(USERS_API_URL, {
    headers: getAuthHeaders(),
  });

  return response.data.users;
};