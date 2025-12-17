const express = require("express");
const {
  addUser,
  getUsers,
  updateUser,
  deleteUser
} = require("../controllers/userController");

const protect = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const router = express.Router();

router.post("/add", protect,upload.single("profileImage"),addUser);
router.get("/", protect, getUsers);
router.put("/:id", protect, updateUser);     // ✏️ EDIT
router.delete("/:id", protect, deleteUser);  // 🗑️ DELETE

module.exports = router;
