const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendUserCredentialsMail } = require("../utils/sendMail");

/* 🔢 Employee ID Generator */
const generateEmployeeId = () => {
  return "ST-EMP" + Math.floor(100000000000 + Math.random() * 900000000000);
};

/* 🔐 Password Generator */
const generatePassword = () => {
  return Math.random().toString(36).slice(-8);
};

/* ================= ADD USER ================= */
exports.addUser = async (req, res) => {
  try {
    // 🛑 DEBUG (optional – remove later)
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const employeeId = generateEmployeeId();
    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // ✅ REQUIRED FIELD CHECK
    if (!req.body.name || !req.body.professionalEmail) {
      return res.status(400).json({
        message: "Name and Professional Email are required"
      });
    }

    const user = await User.create({
      name: req.body.name,
      professionalEmail: req.body.professionalEmail,
      personalEmail: req.body.personalEmail,
      dob: req.body.dob,
      dateOfJoining: req.body.dateOfJoining,
      role: req.body.role,
      employmentType: req.body.employmentType,
      address: req.body.address,
      phone: req.body.phone,

      employeeId,
      password: hashedPassword,

      profileImage: req.file
        ? `http://localhost:5000/uploads/${req.file.filename}`
        : null
    });

    // 📧 SEND EMAIL
    await sendUserCredentialsMail(
      user.personalEmail || user.professionalEmail,
      employeeId,
      plainPassword,
      user.name
    );

    res.json({
      message: "User added successfully",
      user
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

/* ================= GET ALL USERS ================= */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/* ================= UPDATE USER ================= */
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: "Update failed" });
  }
};

/* ================= DELETE USER ================= */
exports.deactivateUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      isActive: false
    });

    res.json({ message: "User deactivated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to deactivate user" });
  }
};

exports.activateUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    isActive: true
  });

  res.json({ message: "User activated" });
};
