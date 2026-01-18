import axios from "axios";

const getApiBaseUrl = () => {
  // Production (Vercel)
  if (
    typeof window !== "undefined" &&
    window.location.origin.includes("vercel.app")
  ) {
    return "https://demo-taskmanager.onrender.com/tasks";
  }
  // Development
  return import.meta.env.VITE_API_URL || "http://localhost:3000/tasks";
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
});
export const getTasks = async () => {
  const data = await api.get("/hien-thi");
  return data;
};
export const addTasks = async (tasks) => {
  const data = await api.post("/add", tasks);
  return data;
};
export const updateTasks = async (id, tasks) => {
  const data = await api.put(`/update/${id}`, tasks);
  return data;
};
export const getByTasks = async (id) => {
  const data = await api.get(`/get/${id}`);
  return data;
};
export const deleteTasks = async (id) => {
  const data = await api.delete(`/delete/${id}`);
  return data;
};
