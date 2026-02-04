import { Request, Response } from "express";
import { City } from "../models/city";
import { CityReview } from "../models/cityReview";
import { User } from "../models/user";
import { getCitiesSortedByRating } from "../utils/getCitiesSortedByRating ";
import { TouristSpot } from "../models/touristSpot";
import { Business } from "../models/business";
import { BusinessReview } from "../models/businessReview";
import mongoose from "mongoose";
import { getUserPopulate } from "../utils/populateOption";
import { sanitizeUser } from "../utils/sanitizeUser";
import { Itineraries } from "../models/itineraries";
import { cleanItinerariesPlaces } from "../utils/cleanItineraries";
import { calculateDuration } from "../utils/calculateDuration";
import { verifyHashedPass } from "../utils/verifyHashedPass";
import { createHashedPassword } from "../utils/createHashedPassword";
import { Notification } from "../models/notification";
import { createUrl } from "../utils/createUrl";

export const getCities = async (req: Request, res: Response) => {
    try {
        const { cityId } = req.params;
        const { byRating, latitude, longitude, maxDistance } = req.query;

        if (cityId) {
            const city = await City.findById(cityId).populate({
                path: 'review',
                select: '-city',
                populate: {
                    path: 'user',
                    select: '-password'
                }
            })

            if (!city) {
                return res.status(404).json({
                    success: false, message: "City not found."
                });
            }

            return res.status(200).json({
                success: true, message: "City fetched successfully!", city,
            });
        }

        if (latitude && longitude) {
            const distance = Number(maxDistance) || 5000; // default 5 km
            const cities = await City.find({
                location: {
                    $near: {
                        $geometry: { type: "Point", coordinates: [Number(longitude), Number(latitude)] },
                        $maxDistance: distance,
                    }
                }
            })
                .populate({ path: 'review', select: '-city', populate: { path: 'user', select: '-password' } })
                .populate('touristSpot', '-city');

            if (!cities.length) {
                res.status(404).json({ success: false, message: "No cities found nearby." });
                return
            }

            res.status(200).json({ success: true, message: "Cities fetched successfully!", cities });
            return
        }

        let cities;

        if (byRating === "true") {
            cities = await getCitiesSortedByRating();
        } else {
            cities = await City.find().populate({
                path: 'review',
                select: '-city',
                populate: {
                    path: 'user', select: 'name profile email'
                }
            }).populate('touristSpot', '-city').sort({ createdAt: -1 });
        }

        if (!cities.length) {
            return res.status(404).json({
                success: false, message: "No cities found."
            });
        }

        res.status(200).json({
            success: true, message: "Cities fetched successfully!", cities,
        });
    } catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};

export const addCityReview = async (req: Request, res: Response) => {
    try {
        const _id = req._id
        const { cityId } = req.params;
        const { rating, comment } = req.body;

        const existingUser = await User.findById(_id);
        const existingCity = await City.findById(cityId);

        if (!existingUser) {
            res.status(404).json({ success: false, message: "User not found." });
            return
        }

        if (!existingCity) {
            res.status(404).json({ success: false, message: "City not found." });
            return
        }

        const newReview = await CityReview.create({ user: _id, city: cityId, rating, comment });

        existingCity.review.push(newReview._id);
        existingUser.cityReview!.push(newReview._id);

        await Promise.all([existingCity.save(), existingUser.save()]);

        return res.status(201).json({
            success: true, message: "Review added successfully!", review: newReview,
        });
    } catch (error) {
        return res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};

export const updateCityReview = async (req: Request, res: Response) => {
    try {
        const _id = req._id;
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        const review = await CityReview.findOne({ _id: reviewId, user: _id });
        if (!review) {
            res.status(404).json({ success: false, message: "Review not found or you are not authorized to update it." });
            return
        }

        review.rating = rating;
        review.comment = comment;
        await review.save();

        return res.status(200).json({
            success: true, message: "Review updated successfully!", review
        });
    } catch (error) {
        return res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
}

export const deleteCityReview = async (req: Request, res: Response) => {
    try {
        const _id = req._id;
        const { reviewId } = req.params;

        const review = await CityReview.findById(reviewId);
        if (!review) {
            res.status(404).json({ success: false, message: "Review not found." });
            return
        }

        if (review.user.toString() !== _id) {
            res.status(403).json({ success: false, message: "You can only delete your own review." });
            return
        }

        await review.deleteOne();

        await City.findByIdAndUpdate(review.city, { $pull: { review: review._id } });

        await User.findByIdAndUpdate(_id, { $pull: { cityReview: review._id } });

        res.status(200).json({ success: true, message: "Review deleted successfully." });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};

export const getTouristSpots = async (req: Request, res: Response) => {
    try {
        const { touristSpotId } = req.params;

        if (touristSpotId) {
            const touristSpot = await TouristSpot.findById(touristSpotId).populate("city", "-review -touristSpot")

            if (!touristSpot) {
                res.status(404).json({
                    success: false, message: "Tourist spot not found."
                });
                return
            }

            return res.status(200).json({
                success: true, message: "Tourist spot details fetched successfully!", touristSpot,
            });
        }

        const touristSpots = await TouristSpot.find().populate("city", "-review -touristSpot")

        return res.status(200).json({
            success: true, message: "All tourist spots fetched successfully!", touristSpots
        });
    } catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
}

export const getBusiness = async (req: Request, res: Response) => {
    try {
        const { businessId } = req.params;
        const { status } = req.query;

        if (businessId) {
            const business = await Business.findById(businessId).populate({
                path: 'review',
                select: '-business',
                populate: {
                    path: 'user',
                    select: 'name profile email'
                }
            })

            if (!business) {
                res.status(404).json({
                    success: false, message: "Business not found."
                });
                return
            }

            return res.status(200).json({
                success: true, message: "Business fetched successfully!", business,
            });
        }

        const query: any = {};
        if (status) query.status = status;

        const businesses = await Business.find(query).populate({
            path: 'review',
            select: '-business',
            populate: {
                path: 'user',
                select: 'name profile email'
            }
        }).sort({ createdAt: -1 })

        if (!businesses.length) {
            res.status(404).json({
                success: false, message: "No businesses found."
            });
            return
        }

        return res.status(200).json({
            success: true, message: "Businesses fetched successfully!", businesses
        });
    } catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};

export const addBusinessReview = async (req: Request, res: Response) => {
    try {
        const _id = req._id
        const { businessId } = req.params;
        const { rating, comment } = req.body;

        const existingUser = await User.findById(_id);
        const existingBusiness = await Business.findById(businessId);

        if (!existingUser) {
            res.status(404).json({ success: false, message: "User not found." });
            return
        }

        if (!existingBusiness) {
            res.status(404).json({ success: false, message: "Business not found." });
            return
        }

        const newReview = await BusinessReview.create({ user: _id, business: businessId, rating, comment });

        existingBusiness.review.push(newReview._id);
        existingUser.businessReview!.push(newReview._id);

        await Promise.all([existingBusiness.save(), existingUser.save()]);

        return res.status(201).json({
            success: true, message: "Review added successfully!", review: newReview,
        });
    } catch (error) {
        return res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};

export const updateBusinessReview = async (req: Request, res: Response) => {
    try {
        const _id = req._id;
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        const review = await BusinessReview.findOne({ _id: reviewId, user: _id });
        if (!review) {
            res.status(404).json({ success: false, message: "Review not found or you are not authorized to update it." });
            return
        }

        review.rating = rating;
        review.comment = comment;
        await review.save();

        return res.status(200).json({
            success: true, message: "Review updated successfully!", review
        });
    } catch (error) {
        return res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
}

export const deleteBusinessReview = async (req: Request, res: Response) => {
    try {
        const _id = req._id;
        const { reviewId } = req.params;

        const review = await BusinessReview.findById(reviewId);
        if (!review) {
            res.status(404).json({ success: false, message: "Review not found." });
            return
        }

        if (review.user.toString() !== _id) {
            res.status(403).json({ success: false, message: "You can only delete your own review." });
            return
        }

        await review.deleteOne();

        await Business.findByIdAndUpdate(review.business, { $pull: { review: review._id } });

        await User.findByIdAndUpdate(_id, { $pull: { businessReview: review._id } });

        res.status(200).json({ success: true, message: "Review deleted successfully." });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};

export const toggleFavouriteCities = async (req: Request, res: Response) => {
    try {
        const _id = req._id;
        const { cityId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(cityId)) {
            res.status(400).json({ success: false, message: "Invalid city ID format." });
            return
        }

        const user = await User.findById(_id);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found." });
            return
        }

        const favourite = user.favouriteCities || [];
        const isFavourite = favourite.map(id => id.toString()).includes(cityId);

        await User.findByIdAndUpdate(
            _id,
            isFavourite
                ? { $pull: { favouriteCities: cityId } }
                : { $addToSet: { favouriteCities: cityId } }
        );

        res.status(200).json({
            success: true,
            message: `City ${isFavourite ? "removed from" : "added to"} favourites.`,
        });

    } catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};

export const toggleFavouriteBusiness = async (req: Request, res: Response) => {
    try {
        const _id = req._id;
        const { businessId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(businessId)) {
            res.status(400).json({ success: false, message: "Invalid business ID format." });
            return
        }

        const user = await User.findById(_id);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found." });
            return
        }

        const favourite = user.favouriteBusinesses || [];

        const isFavourite = favourite.map(id => id.toString()).includes(businessId);

        await User.findByIdAndUpdate(
            _id,
            isFavourite
                ? { $pull: { favouriteBusinesses: businessId } }
                : { $addToSet: { favouriteBusinesses: businessId } }
        );

        res.status(200).json({
            success: true,
            message: `Business ${isFavourite ? "removed from" : "added to"} favourites.`,
        });

    } catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};

export const toggleVisitedCities = async (req: Request, res: Response) => {
    try {
        const _id = req._id;
        const { cityId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(cityId)) {
            res.status(400).json({ success: false, message: "Invalid city ID format." });
            return
        }

        const user = await User.findById(_id);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found." });
            return
        }

        const visited = user.visitedCities || [];

        const isVisited = visited.map(id => id.toString()).includes(cityId);

        await User.findByIdAndUpdate(
            _id,
            isVisited
                ? { $pull: { visitedCities: cityId } }
                : { $addToSet: { visitedCities: cityId } }
        );

        res.status(200).json({
            success: true, message: `City ${isVisited ? "removed from" : "marked as"} visited.`,
        });

    } catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const _id = req._id;

        const user = await User.findById(_id).populate(getUserPopulate).lean()

        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return
        }

        user.itineraries = cleanItinerariesPlaces(user.itineraries, ["review", "touristSpot"]);

        const cleanUser = sanitizeUser(user)

        res.status(200).json({ success: true, user: cleanUser, });

    } catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};

export const createItinerary = async (req: Request, res: Response) => {
    try {
        const _id = req._id
        const { title, description, startDate, endDate, places } = req.body;

        const duration = calculateDuration(startDate, endDate);

        const newItinerary = await Itineraries.create({
            title, description, startDate,
            endDate, duration, places,
        });

        await User.findByIdAndUpdate(
            _id, { $push: { itineraries: newItinerary._id } }, { new: true }
        );

        let populatedItinerary = await Itineraries.findById(newItinerary._id).populate({
            path: "places.placeId",
        }).lean()

        if (populatedItinerary) {
            const cleanedArray = cleanItinerariesPlaces([populatedItinerary], ["review", "touristSpot"]);
            populatedItinerary = cleanedArray[0];
        }


        res.status(201).json({
            success: true, message: "Itinerary created successfully!", itinerary: populatedItinerary,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};

export const updateItinerary = async (req: Request, res: Response) => {
    try {
        const { itineraryId } = req.params;
        const updates = req.body;

        if (!itineraryId) {
            res.status(400).json({ success: false, message: "Itinerary ID is required." });
            return
        }

        const itinerary = await Itineraries.findById(itineraryId);
        if (!itinerary) {
            res.status(404).json({ success: false, message: "Itinerary not found." });
            return
        }

        const allowedFields = ["title", "description", "startDate", "endDate", "places"];
        allowedFields.forEach(field => {
            if (updates[field] !== undefined) {
                (itinerary as any)[field] = updates[field];
            }
        });

        if (updates.startDate || updates.endDate) {
            if (!itinerary.startDate || !itinerary.endDate) {
                res.status(400).json({ success: false, message: "Start date and end date are required to calculate duration." });
                return
            }
            itinerary.duration = calculateDuration(itinerary.startDate, itinerary.endDate);
        }

        const updatedItinerary = await itinerary.save();

        let populatedItinerary = await Itineraries.findById(itineraryId).populate({ path: "places.placeId" }).lean();
        if (populatedItinerary) {
            const cleanedArray = cleanItinerariesPlaces([populatedItinerary], ["review", "touristSpot"]);
            populatedItinerary = cleanedArray[0];
        }

        res.status(200).json({
            success: true, message: "Itinerary updated successfully!", itinerary: populatedItinerary,
        });

    } catch (error: any) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};

export const deleteItinerary = async (req: Request, res: Response) => {
    try {
        const _id = req._id;
        const { itineraryId } = req.params;

        if (!itineraryId) {
            res.status(400).json({ success: false, message: "Itinerary ID is required." });
            return
        }

        const deletedItinerary = await Itineraries.findByIdAndDelete(itineraryId);

        if (!deletedItinerary) {
            res.status(404).json({ success: false, message: "Itinerary not found." });
            return
        }

        await User.findByIdAndUpdate(
            _id, { $pull: { itineraries: itineraryId } }, { new: true }
        );

        res.status(200).json({
            success: true, message: "Itinerary deleted successfully!",
        });

    } catch (error: any) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const _id = req._id;
        const { username, personalization, latitude, longitude } = req.body;

        const user = await User.findById(_id);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found." });
            return;
        }

        const profileUrl = createUrl(req, req.file, "profile");

        if (latitude !== undefined || longitude !== undefined) {
            const currentLocation = user.location?.coordinates || [0, 0];

            user.location = {
                type: "Point",
                coordinates: [
                    longitude ?? currentLocation[0],
                    latitude ?? currentLocation[1]
                ]
            };
        }

        user.username = username ?? user.username;
        user.personalization = personalization ?? user.personalization;
        user.profile = profileUrl;

        await user.save();

        const cleanUser = sanitizeUser(user, {
            remove: ['favouriteCities', 'visitedCities', 'favouriteBusinesses', 'cityReview', 'businessReview', 'itineraries']
        });

        res.status(200).json({
            success: true, message: "Profile updated successfully!", user: cleanUser
        });

    } catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};

export const updatePassword = async (req: Request, res: Response) => {
    try {
        const _id = req._id;
        const { oldPassword, newPassword } = req.body;

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            res.status(400).json({ success: false, message: "Invalid user ID." });
            return
        }

        const user = await User.findById({ _id });
        if (!user) {
            res.status(404).json({
                success: false, message: "User not found."
            });
            return
        }

        const isMatch = await verifyHashedPass(oldPassword, user.password);
        if (!isMatch) {
            res.status(400).json({
                success: false, message: "*Invalid old password."
            });
            return
        }

        const hashedPass = await createHashedPassword(newPassword);
        await User.findByIdAndUpdate(
            { _id }, { password: hashedPass }, { new: true }
        );

        res.status(200).json({
            success: true, message: "Password updated successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};

export const markNotificationsAsRead = async (req: Request, res: Response) => {
    try {
        let { notificationIds } = req.body;

        if (!notificationIds) {
            res.status(400).json({ success: false, message: "Notification ID(s) required" });
            return
        }

        if (!Array.isArray(notificationIds)) {
            notificationIds = [notificationIds];
        }

        const result = await Notification.updateMany(
            { _id: { $in: notificationIds } },
            { $set: { isRead: true } }
        );

        res.status(200).json({
            success: true, message: `${result.modifiedCount} notification(s) marked as read.`,
        });
    } catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal Server Error",
        });
    }
};
