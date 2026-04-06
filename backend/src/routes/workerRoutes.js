const express = require("express");
const router = express.Router();
const {
  register,
  getAllWorkers,
  getWorkerById,
  updateWorker,
  updateAvailability,
  loginWorker,
  claimJob,
} = require("../controllers/workerController");
const { protect } = require("../middlewares/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", loginWorker);
router.get("/", getAllWorkers);
router.get("/:id", getWorkerById);

// Protected routes (worker can update their own profile)
router.put("/:id", protect, updateWorker);
router.put("/:id/availability", protect, updateAvailability);

// Worker claims an open job
router.put("/claims/:jobId", protect, claimJob);

module.exports = router;
