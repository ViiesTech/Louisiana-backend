import { Types } from "mongoose";

export interface ITouristSpot {
    _id?: Types.ObjectId;
    name: string;
    city: Types.ObjectId;
    description?: string;
    history?: string;
    latitude?: number | null;
    longitude?: number | null;
    gallery?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}
