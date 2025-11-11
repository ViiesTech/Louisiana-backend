import { Request, Response } from "express";
import { City } from "../models/city";
import { TouristSpot } from "../models/touristSpot";
import { Business } from "../models/business";
import { businessHoursValidation } from "../validations/business";

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

        const existingCity = await City.findById(city);

        if (!existingCity) {
            res.status(404).json({ success: false, message: "City not found." });
            return
        }
        const newTouristSpot = await TouristSpot.create({
            name, city, description, history, latitude, longitude, gallery
        });

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

export const updateTouristSpot = async (req: Request, res: Response) => {
    try {
        const { touristSpotId } = req.params;
        const { name, city, description, history, latitude, longitude, gallery } = req.body;

        const existingSpot = await TouristSpot.findById(touristSpotId);
        if (!existingSpot) {
            res.status(404).json({ success: false, message: "Tourist spot not found." });
            return
        }

        if (city && city.toString() !== existingSpot.city.toString()) {
            const oldCity = await City.findById(existingSpot.city);
            const newCity = await City.findById(city);

            if (!newCity) {
                return res.status(404).json({ success: false, message: "New city not found." });
            }

            if (oldCity) {
                oldCity.touristSpot = oldCity.touristSpot.filter(
                    (id: any) => id.toString() !== existingSpot._id.toString()
                );
                await oldCity.save();
            }

            newCity.touristSpot.push(existingSpot._id);
            await newCity.save();

            existingSpot.city = newCity._id;
        }

        if (name) existingSpot.name = name;
        if (description) existingSpot.description = description;
        if (history) existingSpot.history = history;
        if (latitude) existingSpot.latitude = latitude;
        if (longitude) existingSpot.longitude = longitude;
        if (gallery) existingSpot.gallery = gallery;

        await existingSpot.save();

        return res.status(200).json({
            success: true, message: "Tourist spot updated successfully!", touristSpot: existingSpot
        });
    } catch (error) {
        return res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "*Internal server error"
        });
    }
};

export const deleteTouristSpot = async (req: Request, res: Response) => {
    try {
        const { touristSpotId } = req.params;

        const touristSpot = await TouristSpot.findById(touristSpotId);
        if (!touristSpot) {
            res.status(404).json({
                success: false, message: "Tourist spot not found."
            });
            return
        }

        const city = await City.findById(touristSpot.city);
        if (city) {
            city.touristSpot = city.touristSpot.filter(
                (id: any) => id.toString() !== touristSpotId
            );
            await city.save();
        }

        await TouristSpot.findByIdAndDelete(touristSpotId);

        return res.status(200).json({
            success: true, message: "Tourist spot deleted successfully!"
        });
    } catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal server error."
        });
    }
};

export const addBusiness = async (req: Request, res: Response) => {
    try {
        const { name, category, description, address, phone, email, website, hours, latitude, longitude, status, gallery } = req.body

        const existingBusiness = await Business.findOne({ email });
        if (existingBusiness) {
            res.status(400).json({
                success: false, message: "A business with this email already exists."
            });
            return
        }

        const newBusiness = await Business.create({
            name, category, description, address, phone, email,
            website, hours, latitude, longitude, status, gallery
        });

        res.status(201).json({
            success: true, message: "Business created successfully!", business: newBusiness
        });

    } catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal server error"
        });
    }
};

export const updateBusiness = async (req: Request, res: Response) => {
    try {
        const { businessId } = req.params;
        const { name, category, description, address, phone, email, website, hours, latitude, longitude, status, gallery } = req.body;

        const existingBusiness = await Business.findById(businessId);
        if (!existingBusiness) {
            res.status(404).json({
                success: false, message: "Business not found."
            });
            return
        }

        if (email && email !== existingBusiness.email) {
            const emailTaken = await Business.findOne({ email });
            if (emailTaken) {
                res.status(400).json({
                    success: false, message: "A business with this email already exists."
                });
                return
            }
        }

        if ("hours" in req.body) {
            const { error } = businessHoursValidation.validate({ hours }, { abortEarly: false });
            if (error) {
                res.status(400).json({
                    success: false, message: error.details.map(d => d.message).join(", "), errors: error.details.map(d => d.message)
                });
                return
            }
        }

        existingBusiness.name = name ?? existingBusiness.name;
        existingBusiness.category = category ?? existingBusiness.category;
        existingBusiness.description = description ?? existingBusiness.description;
        existingBusiness.address = address ?? existingBusiness.address;
        existingBusiness.phone = phone ?? existingBusiness.phone;
        existingBusiness.email = email ?? existingBusiness.email;
        existingBusiness.website = website ?? existingBusiness.website;
        existingBusiness.hours = hours ?? existingBusiness.hours;
        existingBusiness.latitude = latitude ?? existingBusiness.latitude;
        existingBusiness.longitude = longitude ?? existingBusiness.longitude;
        existingBusiness.status = status ?? existingBusiness.status;
        existingBusiness.gallery = gallery ?? existingBusiness.gallery;

        await existingBusiness.save();

        res.status(200).json({
            success: true, message: "Business updated successfully!", business: existingBusiness
        });

    } catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal server error"
        });
    }
};

export const deleteBusiness = async (req: Request, res: Response) => {
    try {
        const { businessId } = req.params;

        const existingBusiness = await Business.findById(businessId);
        if (!existingBusiness) {
            res.status(404).json({
                success: false, message: "Business not found."
            });
            return
        }

        await existingBusiness.deleteOne();

        res.status(200).json({
            success: true, message: "Business deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal server error",
        });
    }
};