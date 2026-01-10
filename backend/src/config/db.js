const mongoose = require("mongoose");

const connectDB = async (uri) => {
  if (!uri) return;
  await mongoose.connect(uri);
};

module.exports = connectDB;
