import mongoose, { Schema } from "mongoose";

const itinerariesSchema = new Schema({
    name:{},
    date:{},
    places: [{ type: Schema.Types.ObjectId, ref: "Itineraries", default: [] }],
}, { timestamps: true });

export const Itineraries = mongoose.model("Itineraries", itinerariesSchema);
