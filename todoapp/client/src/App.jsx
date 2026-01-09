import React, { useState, useEffect } from 'react';
import taskService from './api/taskApi';
import TaskInput from './components/TaskInput';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // State mới để quản lý lỗi cho từng trường
  const [errors, setErrors] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    status: '',
    deadline: ''
  });

  const validateForm = (data) => {
    let newErrors = {};

    if (!data.title?.trim()) {
      newErrors.title = "Tiêu đề không được để trống";
    } else if (data.title.length < 3) {
      newErrors.title = "Tiêu đề phải từ 3 ký tự trở lên";
    }

    if (!data.description?.trim()) {
      newErrors.description = "Mô tả không được để trống";
    } else if (data.description.length < 10) {
      newErrors.description = "Mô tả phải chi tiết hơn (ít nhất 10 ký tự)";
    }

    if (!data.deadline) {
      newErrors.deadline = "Vui lòng chọn hạn chót";
    } else if (new Date(data.deadline) < new Date()) {
      newErrors.deadline = "Hạn chót không được ở quá khứ";
    }

    return newErrors;
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      showToast("Không thể tải dữ liệu", "error");
    }
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, []);

  const showToast = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleAddTask = async (formData) => {
    setLoading(true);
    try {
      await taskService.create(formData);
      showToast("Thêm thành công!", "success");
      fetchTasks();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Lỗi khi thêm task";
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa công việc này?")) {
      try {
        await taskService.delete(id);
        setTasks(tasks.filter(t => t._id !== id));
        showToast("Đã xóa công việc!", "success");
      } catch (err) { showToast("Lỗi khi xóa task", "error"); }
    }
  };

  const openEditModal = (task) => {
    setErrors({}); // Xóa bỏ lỗi cũ khi mở modal mới
    setCurrentTaskId(task._id);
    setEditFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      deadline: task.deadline ? task.deadline.substring(0, 16) : ''
    });
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    // 1. Chạy validate
    const formErrors = validateForm(editFormData);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors); // Cập nhật state lỗi để hiển thị dưới input
      return;
    }

    // 2. Nếu không có lỗi, tiến hành gọi API
    try {
      await taskService.update(currentTaskId, editFormData);
      setIsModalOpen(false);
      setErrors({});
      fetchTasks();
      showToast("Đã cập nhật thành công!", "success");
    } catch (err) {
      showToast("Lỗi khi cập nhật", "error");
    }
  };

  return (
    <div className="wrapper">
      <nav className="navbar">
        <span>Trang chủ</span>
        <span>Quản lý công việc</span>
      </nav>

      <div className="main-content">
        <h1 className="page-title">QUẢN LÝ CÔNG VIỆC</h1>
        {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}

        {/* Truyền hàm validate xuống TaskInput để dùng chung */}
        <TaskInput onAdd={handleAddTask} validateForm={validateForm} />

        {loading ? <LoadingSpinner /> : (
          <div className="table-container">
            <table className="task-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>Chưa có công việc nào</td>
                  </tr>
                ) : (
                  tasks.map((t) => (
                    <tr key={t._id}>
                      <td><strong>{t.title}</strong></td>
                      <td className="desc-cell">{t.description || "No description"}</td>
                      <td>
                        <span className={`status-badge status-${t.status?.toLowerCase()}`}>
                          {t.status}
                        </span>
                      </td>
                      <td>
                        {t.deadline
                          ? new Date(t.deadline).toLocaleString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                          : "N/A"}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-edit-small" onClick={() => openEditModal(t)}>Edit</button>
                          <button className="btn-delete-small" onClick={() => handleDelete(t._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">SỬA CÔNG VIỆC</h2>

            <div className="modal-form">
              <div className="form-group">
                <label>Task</label>
                <input
                  type="text"
                  className={errors.title ? "input-error" : ""}
                  value={editFormData.title}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, title: e.target.value });
                    if (errors.title) setErrors({ ...errors, title: "" }); // Xóa lỗi khi người dùng gõ
                  }}
                />
                {errors.title && <span className="error-text">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label>Description</label>
  <textarea
    className={errors.description ? "input-error" : ""} // Thêm class lỗi
    value={editFormData.description}
    onChange={(e) => {
      setEditFormData({ ...editFormData, description: e.target.value });
      if (errors.description) setErrors({...errors, description: ""}); // Xóa lỗi khi gõ
    }}
    rows="3"
  />
  {/* Hiển thị dòng chữ báo lỗi */}
  {errors.description && <span className="error-text">{errors.description}</span>}
              </div>

              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="datetime-local"
                  className={errors.deadline ? "input-error" : ""}
                  value={editFormData.deadline}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, deadline: e.target.value });
                    if (errors.deadline) setErrors({ ...errors, deadline: "" });
                  }}
                />
                {errors.deadline && <span className="error-text">{errors.deadline}</span>}
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-save" onClick={handleSaveEdit}>Lưu thay đổi</button>
              <button className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;