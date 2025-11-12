import mongoose, { Types } from "mongoose";
import { Document } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  location?: {
    type: "Point"; coordinates: [number, number];
  };
  profile: String;
  personalization: string[];
  otpCode?: string;
  otpExpiresAt?: Date;
  cityReview?: mongoose.Types.ObjectId[];
  businessReview: mongoose.Types.ObjectId[];
  favouriteCities: mongoose.Types.ObjectId[];
  visitedCities: mongoose.Types.ObjectId[];
  favouriteBusinesses: mongoose.Types.ObjectId[];
  itineraries: mongoose.Types.ObjectId[];
  notifications: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPlaceRef {
  placeId: mongoose.Types.ObjectId;
  placeModel: "City" | "TouristSpot";
}

export interface IItinerary extends Document {
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  duration: string;
  places: IPlaceRef[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INotification {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  category?: string;
  title: string;
  description: string;
  data?: Record<string, any>;
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateNotificationParams {
  userId: Types.ObjectId | string;
  title: string;
  description: string;
  category?: string;
  data?: Record<string, any>;
}
