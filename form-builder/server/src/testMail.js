require("dotenv").config();

console.log("MAIL_USER:", process.env.MAIL_USER);
console.log("MAIL_PASS:", process.env.MAIL_PASS ? "OK" : "MISSING");

const sendMail = require("./utils/sendMail");

sendMail({
  to: "email_cua_ban@gmail.com",
  subject: "Test mail",
  html: "<h1>Mail chạy rồi 🎉</h1>",
})
  .then(() => console.log("✅ Gửi mail thành công"))
  .catch((err) => console.error("❌ Lỗi mail:", err));
