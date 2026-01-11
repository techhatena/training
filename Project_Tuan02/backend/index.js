// 1. Khai báo các thư viện
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 2. Middleware (Cấu hình)
app.use(cors()); // Cho phép Frontend gọi API
app.use(express.json()); // Cho phép đọc dữ liệu JSON gửi lên từ Frontend

// 3. Kết nối MongoDB
mongoose.connect('mongodb+srv://cuongDao1605:160507@projecttuan02.8w8n109.mongodb.net/?appName=projectTuan02')
    .then(() => console.log("Đã kết nối MongoDB thành công!"))
    .catch(err => console.log("Lỗi kết nối:", err));

// 4. Tạo Schema (Cấu trúc bảng dữ liệu) 
const ContactSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    description: { type: String }
});

// Tạo Model từ Schema
const ContactModel = mongoose.model('Contact', ContactSchema);

// 5. Tạo API (Điểm nhận yêu cầu từ Frontend)
// Method: POST, Route: /api/contact
app.post('/api/contact', async (req, res) => {
    try {
        const { fullName, email, phone, description } = req.body;

        // Validate dữ liệu cơ bản ở Backend
        if (!fullName || !email || !phone) {
            return res.status(400).json({ message: "Vui lòng điền đủ thông tin!" });
        }

        // Lưu vào Database
        const newContact = new ContactModel({ fullName, email, phone, description });
        await newContact.save();

        res.status(201).json({ message: "Gửi liên hệ thành công!", data: newContact });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
});

// 6. Chạy Server
app.listen(5000, () => {
    console.log("Server đang chạy tại port 5000");
});