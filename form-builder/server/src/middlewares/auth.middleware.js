const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Không có token" });
  }
  const token = authHeader.split(" ")[1]; //Cắt mảng lấy token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //Check token
    req.user = decoded; //Gắn token vào request
    //Gọi next để đi tiếp
    next();
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};
