const Task = require("../models/model");

const formatDate = (date) => {
  if (!date) return null;

  const d = new Date(date);

  // Kiểm tra nếu date invalid
  if (isNaN(d.getTime())) {
    return null;
  }

  // Xác định SA (Sáng 0-11) hay CH (Chiều 12-23)
  const hours = d.getHours();
  const timeOfDay = hours >= 12 ? "CH" : "SA";

  const hoursStr = String(hours).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year} ${hoursStr}:${minutes} ${timeOfDay}`;
};

// Helper function format task response
const formatTaskResponse = (task) => {
  if (Array.isArray(task)) {
    return task.map((t) => {
      const obj = t.toObject();
      return {
        ...obj,
        ngayBatDau: obj.ngayBatDau
          ? formatDate(obj.ngayBatDau)
          : "Chưa cập nhật",
        ngayBatDauRaw: obj.ngayBatDau ? obj.ngayBatDau.toISOString() : null,
        ngayKetThuc: obj.ngayKetThuc
          ? formatDate(obj.ngayKetThuc)
          : "Chưa cập nhật",
        ngayKetThucRaw: obj.ngayKetThuc ? obj.ngayKetThuc.toISOString() : null,
        createdAt: obj.createdAt ? formatDate(obj.createdAt) : "Chưa cập nhật",
        updatedAt: obj.updatedAt ? formatDate(obj.updatedAt) : "Chưa cập nhật",
      };
    });
  }

  const obj = task.toObject();
  return {
    ...obj,
    ngayBatDau: obj.ngayBatDau ? formatDate(obj.ngayBatDau) : "Chưa cập nhật",
    ngayBatDauRaw: obj.ngayBatDau ? obj.ngayBatDau.toISOString() : null,
    ngayKetThuc: obj.ngayKetThuc
      ? formatDate(obj.ngayKetThuc)
      : "Chưa cập nhật",
    ngayKetThucRaw: obj.ngayKetThuc ? obj.ngayKetThuc.toISOString() : null,
    createdAt: obj.createdAt ? formatDate(obj.createdAt) : "Chưa cập nhật",
    updatedAt: obj.updatedAt ? formatDate(obj.updatedAt) : "Chưa cập nhật",
  };
};

exports.createTask = async (req, res) => {
  try {
    let { title, ngayBatDau, ngayKetThuc, moTa, trangThai } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Tạo task thất bại",
        error: "Tiêu đề task không được để trống",
      });
    }

    if (!ngayKetThuc) {
      return res.status(400).json({
        message: "Tạo task thất bại",
        error: "Ngày kết thúc không được để trống",
      });
    }

    // Nếu không có ngayBatDau, bắt buộc user phải nhập
    if (!ngayBatDau) {
      return res.status(400).json({
        message: "Tạo task thất bại",
        error: "Ngày bắt đầu không được để trống",
      });
    }

    // Xử lý ngayBatDau (Nếu chỉ nhập ngày, set giờ = 00:00)
    if (ngayBatDau) {
      const date = new Date(ngayBatDau);
      if (!isNaN(date.getTime())) {
        date.setHours(0, 0, 0, 0);
        ngayBatDau = date;
      }
    }

    // Xử lý ngayKetThuc tương tự
    if (ngayKetThuc) {
      const date = new Date(ngayKetThuc);
      if (!isNaN(date.getTime())) {
        date.setHours(0, 0, 0, 0);
        ngayKetThuc = date;
      }
    }

    // Validate ngayKetThuc > ngayBatDau
    if (new Date(ngayKetThuc) <= new Date(ngayBatDau)) {
      return res.status(400).json({
        message: "Tạo task thất bại",
        error: "Ngày kết thúc phải lớn hơn ngày bắt đầu",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      ngayBatDau,
      ngayKetThuc,
      moTa: moTa || "",
      trangThai: trangThai || false,
    });

    res.status(201).json({
      message: "Tạo task thành công",
      data: formatTaskResponse(task),
    });
  } catch (error) {
    res.status(400).json({
      message: "Tạo task thất bại",
      error: error.message,
    });
  }
};
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(formatTaskResponse(tasks));
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task khong ton tai" });
    }

    res.json(formatTaskResponse(task));
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
exports.updateTask = async (req, res) => {
  try {
    let { title, ngayBatDau, ngayKetThuc, moTa, trangThai } = req.body;

    // Validate title nếu có
    if (title !== undefined && !title.trim()) {
      return res.status(400).json({
        message: "Cập nhật task thất bại",
        error: "Tiêu đề task không được để trống",
      });
    }

    // Get current task để validate date
    const currentTask = await Task.findById(req.params.id);
    if (!currentTask) {
      return res.status(404).json({
        message: "Cập nhật task thất bại",
        error: "Task không tồn tại",
      });
    }

    // Sử dụng giá trị mới hoặc giữ giá trị cũ
    ngayBatDau = ngayBatDau || currentTask.ngayBatDau;
    ngayKetThuc = ngayKetThuc || currentTask.ngayKetThuc;

    // Xử lý date format
    if (ngayBatDau) {
      const date = new Date(ngayBatDau);
      if (!isNaN(date.getTime())) {
        date.setHours(0, 0, 0, 0);
        ngayBatDau = date;
      }
    }

    if (ngayKetThuc) {
      const date = new Date(ngayKetThuc);
      if (!isNaN(date.getTime())) {
        date.setHours(0, 0, 0, 0);
        ngayKetThuc = date;
      }
    }

    // Validate ngayKetThuc > ngayBatDau (chỉ validate nếu cả 2 tồn tại)
    if (
      ngayBatDau &&
      ngayKetThuc &&
      new Date(ngayKetThuc) <= new Date(ngayBatDau)
    ) {
      return res.status(400).json({
        message: "Cập nhật task thất bại",
        error: "Ngày kết thúc phải lớn hơn ngày bắt đầu",
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (moTa !== undefined) updateData.moTa = moTa;
    if (trangThai !== undefined) updateData.trangThai = trangThai;
    if (ngayBatDau) updateData.ngayBatDau = ngayBatDau;
    if (ngayKetThuc) updateData.ngayKetThuc = ngayKetThuc;

    const task = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.json({
      message: "Cập nhật task thành công",
      data: formatTaskResponse(task),
    });
  } catch (error) {
    res.status(400).json({
      message: "Cập nhật task thất bại",
      error: error.message,
    });
  }
};
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Xoa task thanh cong" });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};
