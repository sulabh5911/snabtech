const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  forgotPassword,
  resetPassword
} = require("../controllers/adminController");

const protect = require("../middlewares/auth");

const router = express.Router();


router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


router.get("/dashboard", protect, (req, res) => {
  res.json({
    message: "Welcome Admin Dashboard",
    adminId: req.adminId
  });
});

module.exports = router;
