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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
