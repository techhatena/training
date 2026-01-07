const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    ngayBatDau: {
      type: Date,
      required: false, // Cho phép null để user tự nhập sau
    },

    ngayKetThuc: {
      type: Date,
      required: true,
    },
    moTa: {
      type: String,
      default: "",
    },
    trangThai: {
      type: Boolean,
      default: false,
    },
    lastWarningEmailSent: {
      type: Date,
      default: null, // Track lần cuối gửi warning email
    },
    lastOverdueEmailSent: {
      type: Date,
      default: null, // Track lần cuối gửi overdue email
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Task", taskSchema);
