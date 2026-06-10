const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    designerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    appointmentTime: {
      type: String,
      required: true,
      trim: true,
    },

    serviceType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    contactPhone: {
      type: String,
      trim: true,
      required: true,
    },

    location: {
      type: String,
      trim: true,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "completed",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    cancellationReason: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Query optimization indexes
appointmentSchema.index({
  designerId: 1,
  appointmentDate: 1,
});

appointmentSchema.index({
  clientId: 1,
  appointmentDate: 1,
});

// Prevent duplicate booking
appointmentSchema.index(
  {
    clientId: 1,
    designerId: 1,
    appointmentDate: 1,
    appointmentTime: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Appointment",
  appointmentSchema
);