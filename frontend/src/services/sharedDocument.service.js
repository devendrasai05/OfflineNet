import axios from "axios";

import { API_URL } from "../config";

const DOCUMENT_API_URL = `${API_URL}/shared-documents`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("offlinenet-token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getDocuments = async () => {
  const response = await axios.get(DOCUMENT_API_URL, {
    headers: getAuthHeaders(),
  });

  return response.data.documents;
};

export const uploadDocument = async (formData) => {
  const response = await axios.post(
    `${DOCUMENT_API_URL}/upload`,
    formData,
    {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.document;
};

export const deleteDocument = async (id) => {
  await axios.delete(`${DOCUMENT_API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
};