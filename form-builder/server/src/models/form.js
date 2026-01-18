const mongoose = require("mongoose")
const formSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    // Lưu cấu hình kỹ thuật của dự án
    schema: {
      type: Object,
      required: true,
    },
    // Lưu ID của người tạo ra dự án này để biết ai là chủ
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", //model muốn liên kết
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Form", formSchema)