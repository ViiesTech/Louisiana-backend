import mongoose, { Schema } from "mongoose";
import { IItinerary } from "../types";

const itinerariesSchema = new Schema<IItinerary>({
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    duration: { type: String },
    places: [{
        placeId: { type: Schema.Types.ObjectId, required: true, refPath: "places.placeModel" },
        placeModel: {
            type: String, required: true, enum: ["City", "TouristSpot" , "Business"]
        }
    }],
}, { timestamps: true });

export const Itineraries = mongoose.model<IItinerary>("Itineraries", itinerariesSchema);
