import axios from "axios";

const API_URL = "http://localhost:5000/api/shared-documents";

const getToken = () => localStorage.getItem("offlinenet-token");

export const getDocuments = async () => {
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data.documents;
};

export const uploadDocument = async (formData) => {
  const response = await axios.post(
    `${API_URL}/upload`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data.document;
};