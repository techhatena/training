import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';

// 1. Các hàm gọi lẻ (Named Exports)
export const getTasks = () => axios.get(`${API_URL}/allTasks`);
export const createTask = (taskData) => axios.post(`${API_URL}/createTask`, taskData);
export const updateTask = (id, updatedData) => axios.put(`${API_URL}/update/${id}`, updatedData);
export const deleteTask = (id) => axios.delete(`${API_URL}/delete/${id}`);

// 2. Đối tượng tổng hợp (Default Export) - Đã bổ sung đầy đủ Update
const taskService = {
  getAll: async () => {
    const res = await getTasks();
    return res.data;
  },
  create: async (taskData) => {
    const res = await createTask(taskData);
    return res.data;
  },
  // --- ĐÃ BỔ SUNG Ở ĐÂY ---
  update: async (id, updatedData) => {
    const res = await updateTask(id, updatedData);
    return res.data;
  },
  // ------------------------
  delete: async (id) => {
    const res = await deleteTask(id);
    return res.data;
  }
};

export default taskService;