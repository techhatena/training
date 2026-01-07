import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:3000/tasks",
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
