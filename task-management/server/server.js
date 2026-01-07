const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const taskRoutes = require("./routes/route");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

// CSP Header
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' http://localhost:*"
  );
  next();
});

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Task Management API" });
});

/* ===== CONNECT MONGODB ===== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

/* ===== ROUTES ===== */
app.use("/tasks", taskRoutes);

app.listen(3000, () => {
  console.log("🚀 Server started at http://localhost:3000");
});
