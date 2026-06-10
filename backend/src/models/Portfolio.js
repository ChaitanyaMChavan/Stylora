const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    designerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    category: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: "Maximum 10 images allowed",
      },
    },

    tags: {
      type: [String],
      default: [],
    },

    priceRange: {
      type: String,
      trim: true,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Existing uniqueness protection
portfolioSchema.index(
  { designerId: 1, title: 1 },
  { unique: true }
);

// Search optimization
portfolioSchema.index({ category: 1 });
portfolioSchema.index({ createdAt: -1 });

module.exports = mongoose.model(
  "Portfolio",
  portfolioSchema
);