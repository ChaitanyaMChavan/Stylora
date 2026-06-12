const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Review = require("../models/Review");
const Portfolio = require("../models/Portfolio");
const DesignerProfile = require("../models/DesignerProfile");

const getAdminDashboard = async (
    req,
    res,
    next
) => {
    try {

        const totalUsers =
            await User.countDocuments();

        const totalClients =
            await User.countDocuments({
                role: "client",
            });

        const totalDesigners =
            await User.countDocuments({
                role: "designer",
            });

        const totalAppointments =
            await Appointment.countDocuments();

        const totalReviews =
            await Review.countDocuments();

        const totalPortfolioItems =
            await Portfolio.countDocuments();

        res.status(200).json({
            success: true,
            dashboard: {
                totalUsers,
                totalClients,
                totalDesigners,
                totalAppointments,
                totalReviews,
                totalPortfolioItems,
            },
        });

    } catch (error) {
        next(error);
    }
};

//get all users 
const getAllUsers = async (
    req,
    res,
    next
) => {
    try {

        const users =
            await User.find()
                .select("-password")
                .sort({
                    createdAt: -1,
                });

        res.status(200).json({
            success: true,
            count: users.length,
            users,
        });

    } catch (error) {
        next(error);
    }
};

//get all designers 
const getAllDesigners = async (
    req,
    res,
    next
) => {
    try {

        const designers =
            await DesignerProfile.find()
                .populate(
                    "userId",
                    "name email role"
                )
                .sort({
                    createdAt: -1,
                });

        res.status(200).json({
            success: true,
            count: designers.length,
            designers,
        });

    } catch (error) {
        next(error);
    }
};

//get all appointments
const getAllAppointments =
async (
    req,
    res,
    next
) => {
    try {

        const appointments =
            await Appointment.find()
                .populate(
                    "clientId",
                    "name email"
                )
                .populate(
                    "designerId",
                    "name email"
                )
                .sort({
                    createdAt: -1,
                });

        res.status(200).json({
            success: true,
            count:
                appointments.length,
            appointments,
        });

    } catch (error) {
        next(error);
    }
};

//get all reviews 
const getAllReviews = async (
    req,
    res,
    next
) => {
    try {

        const reviews =
            await Review.find()
                .populate(
                    "clientId",
                    "name email"
                )
                .populate(
                    "designerId",
                    "name email"
                )
                .sort({
                    createdAt: -1,
                });

        res.status(200).json({
            success: true,
            count: reviews.length,
            reviews,
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAdminDashboard,
    getAllUsers,
    getAllDesigners,
    getAllAppointments,
    getAllReviews,
};