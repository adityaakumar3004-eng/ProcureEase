import api from "./api";

// Login User
export const loginUser = async (formData) => {
  const response = await api.post("/auth/login", formData);
  return response.data;
};

// Register User
export const registerUser = async (formData) => {
  const response = await api.post("/auth/register", formData);
  return response.data;
};