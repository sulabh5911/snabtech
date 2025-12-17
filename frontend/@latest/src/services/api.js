import axios from "axios";

/* ADMIN API */
export const adminAPI = axios.create({
  baseURL: "http://localhost:5000/api/admin"
});

/* USER API */
export const userAPI = axios.create({
  baseURL: "http://localhost:5000/api/users"
});
