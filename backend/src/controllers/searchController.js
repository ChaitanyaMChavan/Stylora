const DesignerProfile = require("../models/DesignerProfile");
const Review = require("../models/Review");

const searchDesigners = async (
    req,
    res,
    next
) => {
    try {
        const {
            name,
            location,
            style,
            minExperience,
            minRating,
            sortBy,
        } = req.query;

        const profileFilter = {};

        if (location) {
            profileFilter.location = {
                $regex: location,
                $options: "i",
            };
        }

        if (style) {
            profileFilter.style = {
                $regex: style,
                $options: "i",
            };
        }

        if (minExperience) {
            profileFilter.experience = {
                $gte: Number(minExperience),
            };
        }

        let designers =
            await DesignerProfile.find(
                profileFilter
            ).populate(
                "userId",
                "name email"
            );

        if (name) {
            designers = designers.filter(
                (designer) =>
                    designer.userId?.name
                        ?.toLowerCase()
                        .includes(
                            name.toLowerCase()
                        )
            );
        }

        const designerResults =
            await Promise.all(
                designers.map(
                    async (designer) => {
                        const reviews =
                            await Review.find({
                                designerId:
                                    designer.userId._id,
                            });

                        const totalReviews =
                            reviews.length;

                        let averageRating = 0;

                        if (
                            totalReviews > 0
                        ) {
                            const ratingSum =
                                reviews.reduce(
                                    (
                                        sum,
                                        review
                                    ) =>
                                        sum +
                                        review.rating,
                                    0
                                );

                            averageRating =
                                Number(
                                    (
                                        ratingSum /
                                        totalReviews
                                    ).toFixed(
                                        1
                                    )
                                );
                        }

                        return {
                            ...designer.toObject(),
                            averageRating,
                            totalReviews,
                        };
                    }
                )
            );

        let filteredResults =
            designerResults;

        if (minRating) {
            filteredResults =
                filteredResults.filter(
                    (designer) =>
                        designer.averageRating >=
                        Number(minRating)
                );
        }

        if (sortBy === "rating") {
            filteredResults.sort(
                (a, b) =>
                    b.averageRating -
                    a.averageRating
            );
        }

        if (sortBy === "experience") {
            filteredResults.sort(
                (a, b) =>
                    b.experience -
                    a.experience
            );
        }

        if (sortBy === "newest") {
            filteredResults.sort(
                (a, b) =>
                    new Date(
                        b.createdAt
                    ) -
                    new Date(
                        a.createdAt
                    )
            );
        }

        res.status(200).json({
            success: true,
            count:
                filteredResults.length,
            designers:
                filteredResults,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    searchDesigners,
};