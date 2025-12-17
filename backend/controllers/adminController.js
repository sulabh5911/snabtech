const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Admin = require("../models/Admin");
const { sendMail } = require("../utils/sendMail");


/* ================= REGISTER ================= */
exports.registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    res.json({ message: "Admin registered successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Register failed" });
  }
};

/* ================= LOGIN ================= */
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "7d" : "1d" }
    );

    res.json({ token,admin: {
    name: `${admin.firstName} ${admin.lastName}`,
    email: admin.email
  } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};

/* ================= FORGOT PASSWORD ================= */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Email not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");

    admin.resetToken = token;
    admin.resetTokenExpire = Date.now() + 15 * 60 * 1000;
    await admin.save();

    const link = `http://localhost:5173/reset-password/${token}`;
    // await sendMail(admin.email, link);

    res.json({ message: "Reset link sent to email" });
    sendMail(admin.email, link)
      .then(() => console.log("Reset mail sent"))
      .catch(err => console.error("Mail error:", err));


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Forgot password failed" });
  }
};

/* ================= RESET PASSWORD ================= */
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params; // ✅ ADD THIS

    // ✅ ADD THIS VALIDATION
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const admin = await Admin.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    admin.password = await bcrypt.hash(password, 10);
    admin.resetToken = undefined;
    admin.resetTokenExpire = undefined;

    await admin.save();

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({ message: "Reset password failed" });
  }
};