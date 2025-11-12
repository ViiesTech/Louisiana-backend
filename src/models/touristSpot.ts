import mongoose, { Schema } from "mongoose";
import { ITouristSpot } from "../types/touristSpot";

const TouristSpotSchema = new Schema<ITouristSpot>({
    name: { type: String },
    city: { type: Schema.Types.ObjectId, ref: "City", required: true },
    description: { type: String },
    history: { type: String },
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, 0] }
    },
    gallery: { type: [String], default: [] },
}, { timestamps: true });

TouristSpotSchema.index({ location: "2dsphere" });

export const TouristSpot = mongoose.model<ITouristSpot>("TouristSpot", TouristSpotSchema);
