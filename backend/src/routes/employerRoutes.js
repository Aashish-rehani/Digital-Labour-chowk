const express = require("express");
const router = express.Router();
const {
  createRequest,
  getRequests,
  deleteRequest,
  assignWorker,
  getAllOpenRequests,
  getRequestById,
  completeRequest,
} = require("../controllers/employerController");
const { protect } = require("../middlewares/authMiddleware");

// Public routes for browsing open jobs
router.get("/all/open", getAllOpenRequests);
router.get("/:id/view", getRequestById);

// Protected routes - employer only
router.post("/", protect, createRequest);
router.get("/", protect, getRequests);
router.delete("/:id", protect, deleteRequest);
router.put("/:id/assign", protect, assignWorker);
router.put("/:id/complete", protect, completeRequest);

module.exports = router;
