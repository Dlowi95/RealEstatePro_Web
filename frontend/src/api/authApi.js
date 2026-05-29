import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const API = `${API_BASE_URL}/api/auth`;

export const saveUserToDB = async (userData) => {
  const response = await axios.post(`${API}/register`, userData);
  return response.data;
};