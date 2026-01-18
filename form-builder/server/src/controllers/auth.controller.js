const User = require("../models/user");
const { v4: uuidv4 } = require("uuid"); //dùng phiên bản v4 của uuid - ngẫu nhiên
const sendMail = require("../utils/sendMail");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Định nghĩa hàm register và xuất nó ra
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Thiếu email" });
    }
    if (!password) {
      return res.status(400).json({ message: "Thiếu password" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); //Băm mật khẩu
    const verifyToken = uuidv4();
    const verifyTokenExpire = Date.now() + 15 * 60 * 1000; //mm*ss*msms
    await User.create({
      email,
      password: hashedPassword,
      verifyToken,
      verifyTokenExpire,
    });
    // Link trỏ về backend API, backend sẽ verify rồi redirect về frontend
    const verifyUrl = `${
      process.env.SERVER_URL || "http://localhost:3000"
    }/api/auth/verify/${verifyToken}`;
    await sendMail({
      to: email,
      subject: "Xác thực tài khoản",
      html: `
      <h3>Hi bạn </h3>
      <p>Click link dưới đây để xác thực tài khoản:</p>
      <a href="${verifyUrl}">Click để xác thực</a>
      <p>Link có hiệu lực trong 15 phút</p>
      `,
    });
    res.json({
      message:
        "Đăng ký thành công. Vùi lòng check email của bạn để xác thực account",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server has error" });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpire: { $gt: Date.now() }, //$gt: Greater than lớn hơn, thời gian hết hạn phải lớn hơn date now nếu không -> null
    });
    if (!user) {
      // Redirect về login với message error (không hiển thị token)
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      return res.redirect(
        `${clientUrl}/login?verified=false&message=Token đã hết hạn hoặc không tồn tại`
      );
    }
    user.verified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpire = undefined;
    await user.save();

    // Redirect về login với message success (không hiển thị token)
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    return res.redirect(
      `${clientUrl}/login?verified=true&message=Xác thực thành công! Vui lòng đăng nhập`
    );
  } catch (error) {
    res.status(500).json({
      message: "Server has error",
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }
    if (!user.verified) {
      return res.status(401).json({ message: "Bạn cần xác thực email" });
    }
    //Check password có đúng không
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server has error" });
  }
};

exports.resendVerify = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "Tài khoản đã được xác thực" });
    }
    const verifyToken = uuidv4();
    user.verifyToken = verifyToken;
    useTransition.verifyTokenExpire = Date.now() + 15 * 60 * 1000;
    await user.save();
    const verifyUrl = `${process.env.CLIENT_URL}/verify/${verifyToken}`;
    await sendMail({
      to: email,
      subject: "Xác thực lại tài khoản",
      html: `
      <a href="${verifyUrl}">Click để xác thực</a>
      `,
    });
    res.json({ message: "Đã gửi lại mail xác thực" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    const resetToken = uuidv4();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendMail({
      to: email,
      subject: "Đặt lại mật khẩu",
      html: `
        <p>Click link để đặt lại mật khẩu:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Link hết hạn sau 15 phút.</p>
      `,
    });

    res.json({ message: "Đã gửi mail đặt lại mật khẩu" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    // Validate password
    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "Vui lòng nhập đủ thông tin" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu không khớp" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Mật khẩu phải ít nhất 6 ký tự" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * VERIFY RESET TOKEN
 * Kiểm tra token có hợp lệ không
 * được gọi từ ResetPassword.jsx khi page load
 */
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    res.json({ message: "Token hợp lệ" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
