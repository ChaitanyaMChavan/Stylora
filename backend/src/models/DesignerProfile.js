const mongoose = require("mongoose");

const designerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    style: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    experience: {
      type: Number,
      min: 0,
      default: 0,
    },

    specialization: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 20,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model(
  "DesignerProfile",
  designerProfileSchema
);