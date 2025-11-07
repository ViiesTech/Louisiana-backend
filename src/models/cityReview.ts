import mongoose, { Schema } from "mongoose";
import { ICityReview } from "../types";

const ReviewSchema = new Schema<ICityReview>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    city: { type: Schema.Types.ObjectId, ref: "City", required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
}, { timestamps: true });

export const CityReview = mongoose.model<ICityReview>("CityReview", ReviewSchema);
