import { Request, Response } from "express";
import { City } from "../models/city";
import { CityReview } from "../models/cityReview";
import { User } from "../models/user";
import { getCitiesSortedByRating } from "../utils/getCitiesSortedByRating ";
export const getCities = async (req: Request, res: Response) => {
    try {
        const { cityId } = req.params;
        const { byRating } = req.query;

        if (cityId) {
            const city = await City.findById(cityId).populate({
                path: 'review',
                select: '-city',
                populate: {
                    path: 'user',
                    select: 'name profile email'
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
            })
            .populate('touristSpot' , '-city')
            .sort({ createdAt: -1 });
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
