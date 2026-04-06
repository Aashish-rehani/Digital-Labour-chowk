const express = require("express");
const router = express.Router();
const {
  getPendingWorkers,
  approveWorker,
  rejectWorker,
  getAllUsers,
  blockUser,
  unblockUser,
  blockWorker,
  getStats,
  getAllWorkers,
} = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");

// Admin stats
router.get("/stats", protect, getStats);

// Worker management
router.get("/workers/pending", protect, getPendingWorkers);
router.get("/workers", protect, getAllWorkers);
router.put("/workers/:id/approve", protect, approveWorker);
router.put("/workers/:id/reject", protect, rejectWorker);
router.put("/workers/:id/block", protect, blockWorker);

// User management
router.get("/users", protect, getAllUsers);
router.put("/users/:id/block", protect, blockUser);
router.put("/users/:id/unblock", protect, unblockUser);

module.exports = router;
