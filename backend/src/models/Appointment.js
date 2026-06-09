const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Client ID is required"],
    },
    designerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Designer ID is required"],
    },
    date: {
      type: Date,
      required: [true, "Appointment date is required"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

appointmentSchema.index({ clientId: 1 });
appointmentSchema.index({ designerId: 1 });
appointmentSchema.index({ date: 1 });
appointmentSchema.index({ designerId: 1, date: 1 });
appointmentSchema.index({ clientId: 1, date: 1 });
appointmentSchema.index(
  { clientId: 1, designerId: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
