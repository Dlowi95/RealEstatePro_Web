import axios from "axios";

const API =
"http://localhost:5000/api/auth";

export const saveUserToDB =
async (userData) => {

  const response = await axios.post(
    `${API}/register`,
    userData
  );

  return response.data;
};