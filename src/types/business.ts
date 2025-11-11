import { Types } from "mongoose";

export interface IHour {
    day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
    open: string;
    close: string;
    isClosed?: boolean;
}

export interface IBusiness extends Document {
    _id?: Types.ObjectId;
    name: string;
    category: string;
    description?: string;
    address: string;
    phone: number;
    email: string;
    website?: string;
    hours: IHour[];
    latitude?: number | null;
    longitude?: number | null;
    status: "Active" | "Inactive";
    review: Types.ObjectId[];
    gallery?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IBusinessReview {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    business: Types.ObjectId;
    rating: number;
    comment: string;
    createdAt?: Date;
    updatedAt?: Date;
}

