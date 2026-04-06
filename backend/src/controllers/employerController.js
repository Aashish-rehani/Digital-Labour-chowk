const JobRequest = require("../models/Job");
const Worker = require("../models/Worker");
const { validateJobRequest } = require("../utils/validators");
const translate = require("translate-google");

exports.createRequest = async (req, res) => {
  try {
    const { title, description, location, skill, wage, priority, dueDatetime, latitude, longitude } =
      req.body;

    // Validate input
    const validation = validateJobRequest({
      title,
      description,
      location,
      skill,
      wage,
    });
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    // Translate title and description to Hindi
    let translatedTitleHi = title;
    let translatedDescHi = description;
    try {
      const [titleTrans, descTrans] = await Promise.all([
        translate(title, { from: "en", to: "hi" }),
        translate(description, { from: "en", to: "hi" }),
      ]);
      translatedTitleHi = titleTrans;
      translatedDescHi = descTrans;
    } catch (transError) {
      console.warn(
        "Translation failed, using original text:",
        transError.message,
      );
    }
    
    let geometryData = { type: 'Point', coordinates: [0, 0] };
    if (latitude && longitude) {
      geometryData.coordinates = [parseFloat(longitude), parseFloat(latitude)];
    }

    const jobRequest = new JobRequest({
      title,
      description,
      translations: {
        en: { title, description },
        hi: { title: translatedTitleHi, description: translatedDescHi },
      },
      location,
      skill,
      wage,
      priority: priority || "medium",
      dueDatetime,
      employerId: req.user.id,
      geometry: geometryData
    });

    await jobRequest.save();

    res.status(201).json({
      success: true,
      message: "Job request created successfully",
      jobRequest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all job requests for an employer
exports.getRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { employerId: req.user.id };

    if (status) filter.status = status;

    const jobRequests = await JobRequest.find(filter)
      .populate("employerId", "name email phone")
      .populate("assignedWorkerId", "name email phone skill rating");

    res.status(200).json({
      success: true,
      count: jobRequests.length,
      jobRequests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete job request
exports.deleteRequest = async (req, res) => {
  try {
    const jobRequest = await JobRequest.findById(req.params.id);

    if (!jobRequest) {
      return res.status(404).json({ message: "Job request not found" });
    }

    if (jobRequest.employerId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this request" });
    }

    if (jobRequest.status !== "open") {
      return res
        .status(400)
        .json({ message: "Cannot delete assigned or completed jobs" });
    }

    await JobRequest.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Job request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign worker to job request
exports.assignWorker = async (req, res) => {
  try {
    const { workerId } = req.body;

    if (!workerId) {
      return res.status(400).json({ message: "Please provide worker ID" });
    }

    const jobRequest = await JobRequest.findById(req.params.id);
    if (!jobRequest) {
      return res.status(404).json({ message: "Job request not found" });
    }

    if (jobRequest.employerId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to assign workers to this request" });
    }

    if (jobRequest.status !== "open") {
      return res
        .status(400)
        .json({ message: "Job is already assigned or completed" });
    }

    // Check worker exists and is available
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    if (!worker.availability) {
      return res.status(400).json({ message: "Worker is not available" });
    }

    if (worker.status !== "approved") {
      return res
        .status(400)
        .json({ message: "Worker account is not approved" });
    }

    // Assign worker
    jobRequest.assignedWorkerId = workerId;
    jobRequest.status = "assigned";
    jobRequest.assignedAt = new Date();
    await jobRequest.save();

    // Update worker
    await Worker.findByIdAndUpdate(workerId, { availability: false });

    res.status(200).json({
      success: true,
      message: "Worker assigned successfully",
      jobRequest: await jobRequest.populate(
        "assignedWorkerId",
        "name email phone skill",
      ),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all open job requests (for workers to browse)
exports.getAllOpenRequests = async (req, res) => {
  try {
    const { skill, location, minWage, maxWage, lat, lng } = req.query;
    const filter = { status: "open" };

    if (skill) filter.skill = skill;
    if (location) filter.location = new RegExp(location, "i");
    if (minWage || maxWage) {
      filter.wage = {};
      if (minWage) filter.wage.$gte = Number(minWage);
      if (maxWage) filter.wage.$lte = Number(maxWage);
    }

    if (lat && lng) {
      // GeoSpatial Query
      const pipeline = [
        {
          $geoNear: {
            near: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
            distanceField: "distance",
            query: filter,
            spherical: true,
            distanceMultiplier: 0.001 // meters to kilometers
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "employerId",
            foreignField: "_id",
            as: "employerDetails"
          }
        },
        { $unwind: { path: "$employerDetails", preserveNullAndEmptyArrays: true } }
      ];

      const jobRequests = await JobRequest.aggregate(pipeline);
      
      // format to match mongoose populate
      const formatted = jobRequests.map(job => {
        if (job.employerDetails) {
           job.employerId = {
             _id: job.employerDetails._id,
             name: job.employerDetails.name,
             email: job.employerDetails.email,
             phone: job.employerDetails.phone
           };
        }
        return job;
      });

      return res.status(200).json({
        success: true,
        count: formatted.length,
        jobRequests: formatted,
      });
    }

    // Standard Query
    const jobRequests = await JobRequest.find(filter)
      .populate("employerId", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobRequests.length,
      jobRequests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get job request by ID
exports.getRequestById = async (req, res) => {
  try {
    const jobRequest = await JobRequest.findById(req.params.id)
      .populate("employerId", "name email phone")
      .populate("assignedWorkerId", "name email phone skill rating");

    if (!jobRequest) {
      return res.status(404).json({ message: "Job request not found" });
    }

    res.status(200).json({
      success: true,
      jobRequest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark job as completed
exports.completeRequest = async (req, res) => {
  try {
    const { rating, feedback } = req.body;

    const jobRequest = await JobRequest.findById(req.params.id);
    if (!jobRequest) {
      return res.status(404).json({ message: "Job request not found" });
    }

    if (jobRequest.employerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    jobRequest.status = "completed";
    jobRequest.completedAt = new Date();
    if (rating) jobRequest.rating = rating;
    if (feedback) jobRequest.feedback = feedback;
    await jobRequest.save();

    // Update worker rating and jobs completed
    await Worker.findByIdAndUpdate(jobRequest.assignedWorkerId, {
      $inc: { jobsCompleted: 1 },
      availability: true,
    });

    res.status(200).json({
      success: true,
      message: "Job marked as completed",
      jobRequest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
