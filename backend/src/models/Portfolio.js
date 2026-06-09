const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    designerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Designer ID is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

portfolioSchema.index({ designerId: 1 });
portfolioSchema.index({ designerId: 1, title: 1 }, { unique: true });
portfolioSchema.index({ category: 1 });
portfolioSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Portfolio", portfolioSchema);
