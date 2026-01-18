const Form = require("../models/form");

/**
 * GIẢI THÍCH CREATE FORM:
 * - req.body: { title, schema } từ frontend
 * - owner: lấy từ req.user.id (được set từ auth middleware)
 * - Lưu form mới vào database
 */
exports.createForm = async (req, res) => {
  try {
    const { title, schema } = req.body;

    // Validate
    if (!title) {
      return res.status(400).json({ message: "Thiếu tiêu đề form" });
    }

    const form = await Form.create({
      title,
      schema: schema || {}, // Default là object rỗng nếu chưa có schema
      owner: req.user.id,
    });

    res.status(201).json(form);
  } catch (error) {
    console.error("Lỗi:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
exports.getForms = async (req, res) => {
  const forms = await Form.find({ owner: req.user.id }).sort({ createdAt: -1 });
  res.json(forms);
};
exports.getFormsDetail = async (req, res) => {
  const form = await Form.findOne({
    _id: req.params.id,
    owner: req.user.id,
  });
  if (!form) {
    return res.status(404).json({ message: "Form không tồn tại" });
  }
  res.json(form);
};
exports.updateForm = async (req, res) => {
  const form = await Form.findOneAndUpdate(
    {
      _id: req.params.id,
      owner: req.user.id,
    },
    req.body,
    { new: true }
  );
  res.json(form);
};
exports.deleteForm = async (req, res) => {
  try {
    const form = await Form.findOneAndDelete({
      _id: req.params.id, // Form cần xóa
      owner: req.user.id, // Phải đúng chủ mới cho xóa
    });

    if (!form) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy form hoặc bạn không có quyền!" });
    }

    res.json({ message: "Xóa thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
