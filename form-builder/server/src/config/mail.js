//Tạo phương thức vận chuyển 
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", //địa chỉ
  port: 587, //Cổng dành riêng cho gửi mail
  secure: false, //yêu cầu dùng giao thức STARTTLS không mã háo trước
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
module.exports = transporter;