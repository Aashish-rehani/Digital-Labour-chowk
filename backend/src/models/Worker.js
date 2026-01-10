const mongoose = require("mongoose");

const WorkerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    skills: [String],
    location: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Worker", WorkerSchema);
