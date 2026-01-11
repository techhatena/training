import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  // 1. Tạo State để lưu trữ dữ liệu người dùng nhập
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    description: "",
  });

  const [message, setMessage] = useState(""); // Lưu thông báo thành công/thất bại

  // Hàm xử lý khi người dùng gõ phím
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Hàm xử lý khi bấm nút Gửi (Submit)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trình duyệt load lại trang

    // 2. Validate dữ liệu cơ bản ở Frontend
    if (!formData.fullName || !formData.email || !formData.phone) {
      setMessage("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      // 3. Gọi API sang Backend (đang chạy ở port 5000)
      const response = await axios.post(
        "http://localhost:5000/api/contact",
        formData
      );

      setMessage("Gửi thành công: " + response.data.message);
      // Reset form sau khi gửi
      setFormData({ fullName: "", email: "", phone: "", description: "" });
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi gửi dữ liệu.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Form Liên Hệ</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Họ và tên (*):</label>
          <br />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Email (*):</label>
          <br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Số điện thoại (*):</label>
          <br />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Mô tả:</label>
          <br />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button
          type="submit"
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Gửi thông tin
        </button>
      </form>

      {/* Hiển thị thông báo */}
      {message && <p style={{ marginTop: "10px", color: "blue" }}>{message}</p>}
    </div>
  );
}

export default App;
