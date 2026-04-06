const Worker = require("../models/Worker");
const generateToken = require("../utils/generateToken");
const { validateWorkerRegistration } = require("../utils/validators");
const JobRequest = require("../models/Job");

// Register worker
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, skill, location, experience } =
      req.body;

    // Validate input
    const validation = validateWorkerRegistration({
      name,
      email,
      phone,
      password,
      skill,
      location,
    });
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    // Check if worker already exists
    let worker = await Worker.findOne({ $or: [{ email }, { phone }] });
    if (worker) {
      return res
        .status(409)
        .json({ message: "Worker with this email or phone already exists" });
    }

    // Create worker
    worker = new Worker({
      name,
      email,
      phone,
      password,
      skill,
      location,
      experience: experience || 0,
    });

    await worker.save();

    // Generate token
    const token = generateToken(worker._id);

    res.status(201).json({
      success: true,
      message:
        "Worker registered successfully. You can now access the platform.",
      token,
      worker: {
        id: worker._id,
        name: worker.name,
        email: worker.email,
        skill: worker.skill,
        location: worker.location,
        status: worker.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all workers
exports.getAllWorkers = async (req, res) => {
  try {
    const { skill, location, available } = req.query;
    const filter = { status: "approved", isBlocked: false };

    if (skill) filter.skill = skill;
    if (location) filter.location = new RegExp(location, "i");
    if (available === "true") filter.availability = true;

    const workers = await Worker.find(filter).select("-password");
    res.status(200).json({
      success: true,
      count: workers.length,
      workers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get worker by ID
exports.getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).select("-password");

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json({
      success: true,
      worker,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update worker profile
exports.updateWorker = async (req, res) => {
  try {
    const { name, phone, skill, location, experience } = req.body;
    const fieldsToUpdate = {};

    if (name) fieldsToUpdate.name = name;
    if (phone) fieldsToUpdate.phone = phone;
    if (skill) fieldsToUpdate.skill = skill;
    if (location) fieldsToUpdate.location = location;
    if (experience !== undefined) fieldsToUpdate.experience = experience;

    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json({
      success: true,
      message: "Worker profile updated successfully",
      worker,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update worker availability
exports.updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    if (availability === undefined) {
      return res
        .status(400)
        .json({ message: "Please provide availability status" });
    }

    const worker = await Worker.findByIdAndUpdate(
      req.params.id,
      { availability },
      { new: true },
    ).select("-password");

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      worker,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login worker
exports.loginWorker = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const worker = await Worker.findOne({ email }).select("+password");
    if (!worker) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (worker.isBlocked) {
      return res.status(403).json({ message: "Your account has been blocked" });
    }

    const isMatch = await worker.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(worker._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      worker: {
        id: worker._id,
        name: worker.name,
        email: worker.email,
        skill: worker.skill,
        location: worker.location,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Worker claims an open job
exports.claimJob = async (req, res) => {
  try {
    const workerId = req.user.id;
    const { jobId } = req.params;

    const worker = await Worker.findById(workerId);
    if (!worker) return res.status(404).json({ message: "Worker not found" });

    if (worker.isBlocked)
      return res.status(403).json({ message: "Your account is blocked" });
    if (worker.status !== "approved")
      return res.status(403).json({ message: "Worker not approved" });
    if (!worker.availability)
      return res.status(400).json({ message: "Worker not available" });

    const job = await JobRequest.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.status !== "open")
      return res.status(400).json({ message: "Job is not open for claiming" });

    // Assign worker to job
    job.assignedWorkerId = workerId;
    job.status = "assigned";
    job.assignedAt = new Date();
    await job.save();

    // mark worker unavailable
    worker.availability = false;
    await worker.save();

    res
      .status(200)
      .json({ success: true, message: "Job claimed successfully", job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
