const Worker = require("../models/Worker");
const User = require("../models/User");
const JobRequest = require("../models/Job");

// Get all workers
exports.getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().select("-password");
    res.status(200).json({
      success: true,
      count: workers.length,
      workers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Stub: approval functions removed (auto-approved on registration)
exports.getPendingWorkers = async (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Worker approval removed", workers: [] });
};

exports.approveWorker = async (req, res) => {
  res.status(200).json({ success: true, message: "Worker approval removed" });
};

exports.rejectWorker = async (req, res) => {
  res.status(200).json({ success: true, message: "Worker approval removed" });
};

// Get all users (employers)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Block user
exports.blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User blocked successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unblock user
exports.unblockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User unblocked successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Block worker
exports.blockWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true },
    ).select("-password");

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json({
      success: true,
      message: "Worker blocked successfully",
      worker,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get admin statistics
exports.getStats = async (req, res) => {
  try {
    const totalWorkers = await Worker.countDocuments();
    const pendingWorkers = await Worker.countDocuments({ status: "pending" });
    const approvedWorkers = await Worker.countDocuments({ status: "approved" });
    const rejectedWorkers = await Worker.countDocuments({ status: "rejected" });
    const totalUsers = await User.countDocuments();
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    const blockedWorkers = await Worker.countDocuments({ isBlocked: true });
    const totalJobs = await JobRequest.countDocuments();
    const openJobs = await JobRequest.countDocuments({ status: "open" });
    const assignedJobs = await JobRequest.countDocuments({
      status: "assigned",
    });
    const completedJobs = await JobRequest.countDocuments({
      status: "completed",
    });

    // Calculate average worker rating
    const workerStats = await Worker.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
        },
      },
    ]);
    const avgRating = workerStats.length > 0 ? workerStats[0].avgRating : 0;

    res.status(200).json({
      success: true,
      stats: {
        workers: {
          total: totalWorkers,
          pending: pendingWorkers,
          approved: approvedWorkers,
          rejected: rejectedWorkers,
          blocked: blockedWorkers,
          avgRating: avgRating.toFixed(2),
        },
        users: {
          total: totalUsers,
          blocked: blockedUsers,
        },
        jobs: {
          total: totalJobs,
          open: openJobs,
          assigned: assignedJobs,
          completed: completedJobs,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all workers (for admin)
exports.getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().select("-password");
    res.status(200).json({
      success: true,
      count: workers.length,
      workers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
