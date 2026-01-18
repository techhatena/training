//tạo khung schema collection cho object user
const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
  email:{
    type:String,
    required: true,
    unique: true
  },
  password:{
    type:String,
    required: true
  },
  verified:{
    type: Boolean,
    default: false
  },
  verifyToken: String,
  verifyTokenExpire: Date,

  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {timestamps: true})
module.exports = mongoose.model("User", userSchema);