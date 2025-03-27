const mongoose = require("mongoose");

const LearningPathHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    requestText: {
      type: String,
      required: true,
    },
    responseText: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("LearningPathHistory", LearningPathHistorySchema);
