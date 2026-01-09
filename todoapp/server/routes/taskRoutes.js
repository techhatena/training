const express = require('express');
const router = express.Router();
const Task = require('../models/task');

router.get('/allTasks', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Lỗi lấy dữ liệu: " + err.message });
    }
});

router.post('/createTask', async (req, res) => {
    const { title, description, deadline } = req.body;

    if (!title || title.trim() === "") return res.status(400).json({ message: "Vui lòng nhập tiêu đề!" });
    if (!description || description.trim() === "") return res.status(400).json({ message: "Vui lòng nhập mô tả!" });
    if (!deadline) return res.status(400).json({ message: "Vui lòng nhập hạn chót!" });

    try {
        const newTask = new Task(req.body);
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ message: "Lỗi hệ thống: " + err.message });
    }
});


router.put('/update/:id', async (req, res) => {
    const { title, description, deadline } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({ message: "Vui lòng nhập tiêu đề!" });
    }
    if (!description || description.trim() === "") {
        return res.status(400).json({ message: "Vui lòng nhập mô tả!" });
    }
    if (!deadline) {
        return res.status(400).json({ message: "Vui lòng nhập hạn chót!" });
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true, runValidators: true } 
        );
        if (!updatedTask) return res.status(404).json({ message: "Không tìm thấy task" });
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi cập nhật: " + err.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ message: "Không tìm thấy công việc" });
        res.json({ message: "Xóa công việc thành công!" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi xóa: " + err.message });
    }
});

module.exports = router;