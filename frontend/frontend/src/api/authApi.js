import axios from "axios";

const API_URL = "http://localhost:5000/auth";  // Pas aan indien nodig

// Registreer nieuwe gebruiker
export const registerUser = async (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

// Inloggen en JWT opslaan
export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }
  return response.data;
};

// Reset wachtwoord aanvragen
export const requestPasswordReset = async (email) => {
  return axios.post(`${API_URL}/reset-request`, { email });
};

// Wachtwoord resetten met token
export const resetPassword = async (token, newPassword) => {
  return axios.post(`${API_URL}/reset-password`, { token, newPassword });
};

// Gebruikersprofiel ophalen (met JWT)
export const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  return axios.get("http://localhost:5000/api/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
};
