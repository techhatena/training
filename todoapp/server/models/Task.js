// Định nghĩa cấu trúc dữ liệu Task
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date },
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    },
});

module.exports = mongoose.model('Task', taskSchema);