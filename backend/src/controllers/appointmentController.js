const Appointment = require("../models/Appointment");

//create appointment
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

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

//get appointments for client
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

//get appointments for designer
const getDesignerAppointments = async (
  req,
  res,
  next
) => {
  try {
    const appointments = await Appointment.find({
      designerId: req.user.userId,
    })
      .populate("clientId", "name email")
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

//get appointment by id
const getAppointmentById = async (
  req,
  res,
  next
) => {
  try {
    const appointment =
      await Appointment.findById(
        req.params.id
      )
        .populate("clientId", "name email")
        .populate("designerId", "name email");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const userId = req.user.userId;

    const isOwner =
      appointment.clientId._id.toString() ===
        userId ||
      appointment.designerId._id.toString() ===
        userId;

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

//accept appointment
const acceptAppointment = async (
  req,
  res,
  next
) => {
  try {
    const appointment =
      await Appointment.findById(
        req.params.id
      );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (
      appointment.designerId.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    appointment.status = "accepted";

    await appointment.save();

    res.status(200).json({
      success: true,
      message:
        "Appointment accepted successfully",
    });
  } catch (error) {
    next(error);
  }
};

//reject appointment
const rejectAppointment = async (
  req,
  res,
  next
) => {
  try {
    const appointment =
      await Appointment.findById(
        req.params.id
      );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (
      appointment.designerId.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    appointment.status = "rejected";

    await appointment.save();

    res.status(200).json({
      success: true,
      message:
        "Appointment rejected successfully",
    });
  } catch (error) {
    next(error);
  }
};

//complete appointment
const completeAppointment = async (
  req,
  res,
  next
) => {
  try {
    const appointment =
      await Appointment.findById(
        req.params.id
      );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (
      appointment.designerId.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    appointment.status = "completed";

    await appointment.save();

    res.status(200).json({
      success: true,
      message:
        "Appointment marked completed",
    });
  } catch (error) {
    next(error);
  }
};

//cancel appointment
const cancelAppointment = async (
  req,
  res,
  next
) => {
  try {
    const appointment =
      await Appointment.findById(
        req.params.id
      );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const userId = req.user.userId;

    const allowed =
      appointment.clientId.toString() ===
        userId ||
      appointment.designerId.toString() ===
        userId;

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    appointment.status = "cancelled";

    appointment.cancellationReason =
      req.body.reason || "";

    await appointment.save();

    res.status(200).json({
      success: true,
      message:
        "Appointment cancelled successfully",
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
};