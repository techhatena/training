import React, { useState } from 'react';

function TaskInput({ onAdd, validateForm }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    status: 'Pending'
  });

  // State riêng để quản lý lỗi hiển thị tại form Add Task
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Sử dụng hàm validateForm được truyền từ App.jsx
    const formErrors = validateForm(formData);

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Nếu không có lỗi
    onAdd(formData);
    // Reset form và lỗi
    setFormData({ title: '', description: '', deadline: '', status: 'Pending' });
    setErrors({});
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <div className="add-task-card">
      <h2 className="form-title">ADD TASK</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label>Task</label>
          <input 
            type="text" 
            className={errors.title ? "input-error" : ""}
            placeholder="Tên công việc..."
            value={formData.title} 
            onChange={e => handleChange('title', e.target.value)} 
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <input 
            type="text" 
            className={errors.description ? "input-error" : ""}
            placeholder="Mô tả chi tiết..."
            value={formData.description} 
            onChange={e => handleChange('description', e.target.value)} 
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label>Deadline</label>
          <input 
            type="datetime-local" 
            className={errors.deadline ? "input-error" : ""}
            value={formData.deadline} 
            onChange={e => handleChange('deadline', e.target.value)} 
          />
          {errors.deadline && <span className="error-text">{errors.deadline}</span>}
        </div>

        <div className="form-group">
          <label>Status</label>
          <div className="radio-group">
            {['Pending', 'Completed'].map(s => (
              <label key={s} className="radio-label">
                <input 
                  type="radio" 
                  name="status" 
                  value={s}
                  checked={formData.status === s} 
                  onChange={(e) => setFormData({...formData, status: e.target.value})} 
                /> 
                {s}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-submit">Add Task</button>
      </form>
    </div>
  );
}

export default TaskInput;