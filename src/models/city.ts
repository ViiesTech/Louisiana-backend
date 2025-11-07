import mongoose, { Schema } from "mongoose";
import { ICity } from "../types";

const CitySchema = new Schema<ICity>({
    name: { type: String },
    type: { type: String },
    description: { type: String },
    history: { type: String },
    address: { type: String },
    phone: { type: Number },
    website: { type: String },
    hours: { type: String },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    review: [{ type: Schema.Types.ObjectId, ref: "CityReview", default: [] }],
    gallery: { type: [String], default: [] },
    touristSpot: [{ type: Schema.Types.ObjectId, ref: "TouristSpot", default: [] }],
}, { timestamps: true });

export const City = mongoose.model<ICity>("City", CitySchema);
