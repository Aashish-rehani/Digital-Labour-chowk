const mongoose = require("mongoose");

const jobRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide job title"],
  },
  description: {
    type: String,
    required: [true, "Please provide job description"],
  },
  translations: {
    en: {
      title: { type: String },
      description: { type: String },
    },
    hi: {
      title: { type: String },
      description: { type: String },
    },
  },
  location: {
    type: String,
    required: [true, "Please provide job location"],
  },
  skill: {
    type: String,
    required: [true, "Please specify required skill"],
  },
  skill: {
    type: String,
    required: [true, "Please specify required skill"],
  },
  wage: {
    type: Number,
    required: [true, "Please provide wage amount"],
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedWorkerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker",
    default: null,
  },
  status: {
    type: String,
    enum: ["open", "assigned", "completed", "cancelled"],
    default: "open",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  dueDatetime: {
    type: Date,
  },
  assignedAt: {
    type: Date,
    default: null,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  feedback: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0] // Default to 0,0 if not provided
    }
  }
});

jobRequestSchema.index({ geometry: '2dsphere' });

module.exports = mongoose.model("JobRequest", jobRequestSchema);
