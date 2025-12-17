const express = require("express");
const {
  addUser,
  getUsers,
  updateUser,
  deactivateUser,
  activateUser
} = require("../controllers/userController");

const protect = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const router = express.Router();

router.post("/add", protect,upload.single("profileImage"),addUser);
router.get("/", protect, getUsers);
router.put("/:id", protect, updateUser);     // ✏️ EDIT
router.put("/deactivate/:id", protect, deactivateUser);
router.put("/activate/:id", activateUser);

module.exports = router;
