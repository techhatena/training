const transporter = require("../config/mail")
const sendMail = async({to, subject, html})=>{
  await transporter.sendMail({
    from:`"Form Builder: " ${process.env.MAIL_USER}`,
    to,
    subject,
    html
  })
}
module.exports = sendMail;