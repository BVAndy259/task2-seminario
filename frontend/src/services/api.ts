import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export const API_URL = process.env.API_URL_BACK || "http://localhost:3000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

export default api;
