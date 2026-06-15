const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");
const DesignerProfile = require("../models/DesignerProfile");

// Create appointment
const createAppointment = async (req, res, next) => {
  try {
    const {
      designerId,
      appointmentDate,
      appointmentTime,
      serviceType,
      notes,
      contactPhone,
      location,
    } = req.body;

    if (
      !designerId ||
      !appointmentDate ||
      !appointmentTime ||
      !serviceType ||
      !contactPhone ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    if (designerId === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot book yourself",
      });
    }

    const bookingDate = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: "Appointment date must be in the future",
      });
    }

    const existingSlot = await Appointment.findOne({
      designerId,
      appointmentDate,
      appointmentTime,
      status: {
        $nin: ["cancelled", "rejected"],
      },
    });

    if (existingSlot) {
      return res.status(409).json({
        success: false,
        message: "Designer already booked for this time slot",
      });
    }

    const appointment = await Appointment.create({
      clientId: req.user.userId,
      designerId,
      appointmentDate,
      appointmentTime,
      serviceType,
      notes,
      contactPhone,
      location,
    });

    await Notification.create({
      userId: designerId,
      title: "New Appointment Request",
      message: "You have received a new appointment request.",
      type: "appointment",
    });

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Appointment already exists",
      });
    }
    next(error);
  }
};

// Get appointments for client
const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({
      clientId: req.user.userId,
    })
      .populate("designerId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

// Get appointments for designer
const getDesignerAppointments = async (req, res, next) => {
  try {
    const designerProfile = await DesignerProfile.findOne({ userId: req.user.userId });

    if (!designerProfile) {
      return res.status(404).json({
        success: false,
        message: "Designer profile not found for this user account.",
      });
    }

    const appointments = await Appointment.find({
      $or: [
        { designerId: req.user.userId },
        { designerId: designerProfile._id }
      ]
    }).sort({ appointmentDate: 1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    next(error);
  }
};

// Get appointment by id
const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("clientId", "name email")
      .populate("designerId", "name email");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const userId = req.user.userId;
    const designerProfile = await DesignerProfile.findOne({ userId });

    const isOwner =
      appointment.clientId._id.toString() === userId ||
      appointment.designerId._id.toString() === userId ||
      (designerProfile && appointment.designerId.toString() === designerProfile._id.toString());

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// Accept appointment
const acceptAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Lookup profile to handle User ID vs Profile ID validation fallback
    const designerProfile = await DesignerProfile.findOne({ userId: req.user.userId });

    const isAuthorized = 
      appointment.designerId.toString() === req.user.userId ||
      (designerProfile && appointment.designerId.toString() === designerProfile._id.toString());

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (!canTransition(appointment.status, "accepted")) {
      return res.status(400).json({
        success: false,
        message: `Cannot change appointment from ${appointment.status} to accepted`,
      });
    }

    appointment.status = "accepted";
    await appointment.save();

    await Notification.create({
      userId: appointment.clientId,
      title: "Appointment Accepted",
      message: "Your appointment request has been accepted.",
      type: "appointment",
    });

    return res.status(200).json({
      success: true,
      message: "Appointment accepted successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// Reject appointment
const rejectAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const designerProfile = await DesignerProfile.findOne({ userId: req.user.userId });

    const isAuthorized = 
      appointment.designerId.toString() === req.user.userId ||
      (designerProfile && appointment.designerId.toString() === designerProfile._id.toString());

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (!canTransition(appointment.status, "rejected")) {
      return res.status(400).json({
        success: false,
        message: `Cannot change appointment from ${appointment.status} to rejected`,
      });
    }

    appointment.status = "rejected";
    await appointment.save();

    await Notification.create({
      userId: appointment.clientId,
      title: "Appointment Rejected",
      message: "Your appointment request has been rejected.",
      type: "appointment",
    });

    return res.status(200).json({
      success: true,
      message: "Appointment rejected successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// Complete appointment
const completeAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const designerProfile = await DesignerProfile.findOne({ userId: req.user.userId });

    const isAuthorized = 
      appointment.designerId.toString() === req.user.userId ||
      (designerProfile && appointment.designerId.toString() === designerProfile._id.toString());

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (!canTransition(appointment.status, "completed")) {
      return res.status(400).json({
        success: false,
        message: `Cannot change appointment from ${appointment.status} to completed`,
      });
    }

    appointment.status = "completed";
    await appointment.save();

    await Notification.create({
      userId: appointment.clientId,
      title: "Appointment Completed",
      message: "Your appointment has been completed.",
      type: "appointment",
    });

    return res.status(200).json({
      success: true,
      message: "Appointment completed successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel appointment
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const userId = req.user.userId;
    const designerProfile = await DesignerProfile.findOne({ userId });

    const allowed =
      appointment.clientId.toString() === userId ||
      appointment.designerId.toString() === userId ||
      (designerProfile && appointment.designerId.toString() === designerProfile._id.toString());

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (!canTransition(appointment.status, "cancelled")) {
      return res.status(400).json({
        success: false,
        message: `Cannot change appointment from ${appointment.status} to cancelled`,
      });
    }

    appointment.status = "cancelled";
    appointment.cancellationReason = req.body.reason || "";
    await appointment.save();

    const targetUser = appointment.clientId.toString() === req.user.userId
      ? appointment.designerId
      : appointment.clientId;

    await Notification.create({
      userId: targetUser,
      title: "Appointment Cancelled",
      message: "An appointment has been cancelled.",
      type: "appointment",
    });

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// Valid Transitions Matrix
const VALID_TRANSITIONS = {
  pending: ["accepted", "rejected", "cancelled"],
  accepted: ["completed", "cancelled"],
  rejected: [],
  completed: [],
  cancelled: [],
};

const canTransition = (currentStatus, nextStatus) => {
  return VALID_TRANSITIONS[currentStatus]?.includes(nextStatus);
};

// Mark appointment as paid
const markAppointmentPaid = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.clientId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Only client can mark payment",
      });
    }

    const { amount } = req.body;

    if (appointment.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message: "Appointment must be accepted before payment",
      });
    }

    if (appointment.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Appointment already marked as paid",
      });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid payment amount required",
      });
    }

    appointment.paymentStatus = "paid";
    appointment.paymentAmount = Number(amount);
    appointment.paymentDate = new Date();

    await appointment.save();

    await Notification.create({
      userId: appointment.designerId,
      title: "Payment Received",
      message: "Client has marked payment as completed.",
      type: "payment",
    });

    res.status(200).json({
      success: true,
      message: "Payment marked successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getDesignerAppointments,
  getAppointmentById,
  acceptAppointment,
  rejectAppointment,
  completeAppointment,
  cancelAppointment,
  canTransition,
  markAppointmentPaid,
};