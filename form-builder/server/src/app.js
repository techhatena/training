// import các thư viện vào file code
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config(); //khởi động dotenv

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/forms", require("./routes/form.routes"));

module.exports = app;
