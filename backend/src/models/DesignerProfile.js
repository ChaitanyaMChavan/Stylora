const mongoose = require("mongoose");

const designerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    bio: {
      type: String,
      trim: true,
    },
    experience: {
      type: Number,
      min: [0, "Experience cannot be negative"],
    },
    location: {
      type: String,
      trim: true,
    },
    style: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

designerProfileSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model("DesignerProfile", designerProfileSchema);
