const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateMe,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);

module.exports = router;
