import { Types } from "mongoose";

export interface ITouristSpot {
    _id?: Types.ObjectId;
    name: string;
    city: Types.ObjectId;
    description?: string;
    history?: string;
    location?: {
        type: "Point"; coordinates: [number, number];
    };
    gallery?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}
