import React, { useState } from 'react';
import { updateTask } from '../api/taskApi';

function TaskItem({ task, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

  const toggleComplete = async () => {
    await updateTask(task._id, { completed: !task.completed });
    onUpdate(); // Load lại danh sách ở App.jsx
  };

  const handleSave = async () => {
    if (!newTitle.trim()) return;
    await updateTask(task._id, { title: newTitle });
    setIsEditing(false);
    onUpdate();
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input 
          type="checkbox" 
          checked={task.completed} 
          onChange={toggleComplete} 
        />
        
        {isEditing ? (
          <input 
            value={newTitle} 
            onChange={(e) => setNewTitle(e.target.value)} 
            onBlur={handleSave} // Tự lưu khi click ra ngoài
            autoFocus
          />
        ) : (
          <span onDoubleClick={() => setIsEditing(true)}>{task.title}</span>
        )}
      </div>

      <div className="task-actions">
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Lưu' : 'Sửa'}
        </button>
        <button onClick={() => onDelete(task._id)} className="btn-delete">Xóa</button>
      </div>
    </div>
  );
}

export default TaskItem;