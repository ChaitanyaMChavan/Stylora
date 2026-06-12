const Appointment = require("../models/Appointment");
const Review = require("../models/Review");
const Portfolio = require("../models/Portfolio");
const Notification = require("../models/Notification");

const getDesignerDashboard = async (
    req,
    res,
    next
) => {
    try {
        const designerId = req.user.userId;

        const totalAppointments =
            await Appointment.countDocuments({
                designerId,
            });

        const pendingAppointments =
            await Appointment.countDocuments({
                designerId,
                status: "pending",
            });

        const acceptedAppointments =
            await Appointment.countDocuments({
                designerId,
                status: "accepted",
            });

        const completedAppointments =
            await Appointment.countDocuments({
                designerId,
                status: "completed",
            });

        const cancelledAppointments =
            await Appointment.countDocuments({
                designerId,
                status: "cancelled",
            });

        const totalPortfolioItems =
            await Portfolio.countDocuments({
                designerId,
            });

        const paidAppointmentRecords =
            await Appointment.find({
                designerId,
                paymentStatus: "paid",
            });

        const unpaidAppointments =
            await Appointment.countDocuments({
                designerId,
                paymentStatus: "unpaid",
            });

        const totalRevenue =
            paidAppointmentRecords.reduce(
                (sum, appointment) =>
                    sum +
                    (appointment.paymentAmount || 0),
                0
            );

        const reviews =
            await Review.find({
                designerId,
            });

        const totalReviews =
            reviews.length;

        let averageRating = 0;

        if (totalReviews > 0) {
            const ratingSum =
                reviews.reduce(
                    (sum, review) =>
                        sum + review.rating,
                    0
                );

            averageRating = Number(
                (
                    ratingSum /
                    totalReviews
                ).toFixed(1)
            );
        }

        res.status(200).json({
            success: true,
            dashboard: {
                totalAppointments,
                pendingAppointments,
                acceptedAppointments,
                completedAppointments,
                cancelledAppointments,

                paidAppointments:
                    paidAppointmentRecords.length,

                unpaidAppointments,

                totalRevenue,

                totalPortfolioItems,

                totalReviews,

                averageRating,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getClientDashboard = async (
    req,
    res,
    next
) => {
    try {
        const clientId = req.user.userId;

        const totalAppointments =
            await Appointment.countDocuments({
                clientId,
            });

        const pendingAppointments =
            await Appointment.countDocuments({
                clientId,
                status: "pending",
            });

        const acceptedAppointments =
            await Appointment.countDocuments({
                clientId,
                status: "accepted",
            });

        const completedAppointments =
            await Appointment.countDocuments({
                clientId,
                status: "completed",
            });

        const cancelledAppointments =
            await Appointment.countDocuments({
                clientId,
                status: "cancelled",
            });

        const totalReviewsGiven =
            await Review.countDocuments({
                clientId,
            });

        const unreadNotifications =
            await Notification.countDocuments({
                userId: clientId,
                isRead: false,
            });

        const paidAppointments =
            await Appointment.countDocuments({
                clientId,
                paymentStatus: "paid",
            });

        const unpaidAppointments =
            await Appointment.countDocuments({
                clientId,
                paymentStatus: "unpaid",
            });

        res.status(200).json({
            success: true,
            dashboard: {
                totalAppointments,
                pendingAppointments,
                acceptedAppointments,
                completedAppointments,
                cancelledAppointments,

                paidAppointments,
                unpaidAppointments,

                totalReviewsGiven,
                unreadNotifications,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDesignerDashboard,
    getClientDashboard,
};