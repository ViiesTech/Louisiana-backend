import mongoose, { Schema } from "mongoose";
import { IBusinessReview } from "../types";

const ReviewSchema = new Schema<IBusinessReview>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    business: { type: Schema.Types.ObjectId, ref: "Business", required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
}, { timestamps: true });

export const BusinessReview = mongoose.model<IBusinessReview>("BusinessReview", ReviewSchema);
