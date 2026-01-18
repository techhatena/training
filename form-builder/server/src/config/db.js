const mongoose = require("mongoose");

// async - đánh dấu hàm bất đồng bộ
const connectDB = async ()=>{
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Mongo connect successfully");
  } catch (err) {
    console.log("Mongo error: ", err.message);
    process.exit(1); //ép buộc dừng chương trình lập tức 1: fail
  }
}
module.exports = connectDB;