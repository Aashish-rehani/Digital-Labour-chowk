const Worker = require("../models/Worker");

exports.getWorkers = async (req, res) => {
  const workers = await Worker.find();
  res.json(workers);
};
