const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/digital-labour-chowk",
    {},
  )
  .then(async () => {
    console.log("Connected to MongoDB");
    const db = mongoose.connection.db;
    const result = await db
      .collection("workers")
      .updateMany({ status: "pending" }, { $set: { status: "approved" } });
    console.log(
      "Updated",
      result.modifiedCount,
      "workers from pending to approved",
    );
    await mongoose.disconnect();
    console.log("Done");
  })
  .catch((e) => {
    console.error("Error:", e.message);
    process.exit(1);
  });
