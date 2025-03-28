const mongoose = require("mongoose");

const CareerPathHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
    achievements: {
      type: [String],
      default: [],
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
  { timestamps: true }
);

module.exports = mongoose.model("CareerPathHistory", CareerPathHistorySchema);