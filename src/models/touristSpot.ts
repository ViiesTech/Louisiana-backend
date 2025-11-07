import mongoose, { Schema } from "mongoose";
import { ITouristSpot } from "../types/touristSpot";

const TouristSpotSchema = new Schema<ITouristSpot>({
    name: { type: String },
    city: { type: Schema.Types.ObjectId, ref: "City", required: true },
    description: { type: String },
    history: { type: String },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    gallery: { type: [String], default: [] },
}, { timestamps: true });

export const TouristSpot = mongoose.model<ITouristSpot>("TouristSpot", TouristSpotSchema);
