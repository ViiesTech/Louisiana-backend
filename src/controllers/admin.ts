import { Request, Response } from "express";
import { City } from "../models/city";
import { TouristSpot } from "../models/touristSpot";

export const addCity = async (req: Request, res: Response) => {
    try {
        const { name, type, description, history, address, phone, website, hours, latitude, longitude, gallery } = req.body

        const existingCity = await City.findOne({ name });
        if (existingCity) {
            return res.status(400).json({
                success: false, message: "*A city with this name already exists.",
            });
        }

        const newCity = await City.create({
            name, type, description, history, address, phone,
            website, hours, latitude, longitude, gallery: gallery,
        });

        res.status(201).json({
            success: true, message: "City added successfully!", city: newCity
        });

    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
}

export const updateCity = async (req: Request, res: Response) => {
    try {
        const { cityId } = req.params;
        const updateData = req.body;

        const city = await City.findById(cityId);
        if (!city) {
            return res.status(404).json({
                success: false, message: "*City not found."
            });
        }

        Object.keys(updateData).forEach((key) => {
            if (updateData[key] !== undefined && updateData[key] !== null) {
                (city as any)[key] = updateData[key];
            }
        });

        await city.save();

        res.status(200).json({
            success: true, message: "City updated successfully!", city
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "*Internal server error",
        });
    }
};


export const addTouristSpot = async (req: Request, res: Response) => {
    try {
        const { name, city, description, history, latitude, longitude, gallery } = req.body
        const newTouristSpot = await TouristSpot.create({
            name, city, description, history, latitude, longitude, gallery
        });

        const existingCity = await City.findById(city);
        
        if (!existingCity) {
            res.status(404).json({ success: false, message: "City not found." });
            return
        }
        existingCity.touristSpot.push(newTouristSpot._id);
        await existingCity.save();

        return res.status(201).json({
            success: true, message: "Tourist spot added successfully!", touristSpot: newTouristSpot,
        });
    } catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "*Internal server error"
        });
    }
}
