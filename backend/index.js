require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const adminAuthRoutes = require("./routes/adminAuth");
const userRoutes = require("./routes/userRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminAuthRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend API is running",
  });
});

module.exports = app;
