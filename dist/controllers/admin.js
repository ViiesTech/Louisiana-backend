"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBusiness = exports.updateBusiness = exports.addBusiness = exports.deleteTouristSpot = exports.updateTouristSpot = exports.addTouristSpot = exports.updateCity = exports.addCity = void 0;
const city_1 = require("../models/city");
const touristSpot_1 = require("../models/touristSpot");
const business_1 = require("../models/business");
const business_2 = require("../validations/business");
const addCity = async (req, res) => {
    try {
        const { name, type, description, history, address, phone, website, hours, latitude, longitude, gallery } = req.body;
        const existingCity = await city_1.City.findOne({ name });
        if (existingCity) {
            return res.status(400).json({
                success: false, message: "*A city with this name already exists.",
            });
        }
        const newCity = await city_1.City.create({
            name, type, description, history, address,
            website, hours, gallery: gallery, phone,
            location: {
                type: "Point",
                coordinates: [longitude, latitude]
            },
        });
        res.status(201).json({
            success: true, message: "City added successfully!", city: newCity
        });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
};
exports.addCity = addCity;
const updateCity = async (req, res) => {
    try {
        const { cityId } = req.params;
        const { latitude, longitude, ...updateData } = req.body;
        const city = await city_1.City.findById(cityId);
        if (!city) {
            return res.status(404).json({
                success: false, message: "*City not found."
            });
        }
        if (latitude !== undefined || longitude !== undefined) {
            const currentCoords = city.location?.coordinates || [0, 0];
            const newLongitude = longitude !== undefined ? parseFloat(longitude) : currentCoords[0];
            const newLatitude = latitude !== undefined ? parseFloat(latitude) : currentCoords[1];
            city.location = {
                type: "Point",
                coordinates: [newLongitude, newLatitude],
            };
        }
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] !== undefined && updateData[key] !== null) {
                city[key] = updateData[key];
            }
        });
        await city.save();
        res.status(200).json({
            success: true, message: "City updated successfully!", city
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "*Internal server error",
        });
    }
};
exports.updateCity = updateCity;
const addTouristSpot = async (req, res) => {
    try {
        const { name, city, description, history, latitude, longitude, gallery } = req.body;
        const existingCity = await city_1.City.findById(city);
        if (!existingCity) {
            res.status(404).json({ success: false, message: "City not found." });
            return;
        }
        const newTouristSpot = await touristSpot_1.TouristSpot.create({
            name, city, description, history, gallery,
            location: {
                type: "Point",
                coordinates: [longitude, latitude],
            },
        });
        existingCity.touristSpot.push(newTouristSpot._id);
        await existingCity.save();
        return res.status(201).json({
            success: true, message: "Tourist spot added successfully!", touristSpot: newTouristSpot,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "*Internal server error"
        });
    }
};
exports.addTouristSpot = addTouristSpot;
const updateTouristSpot = async (req, res) => {
    try {
        const { touristSpotId } = req.params;
        const { name, city, description, history, latitude, longitude, gallery } = req.body;
        const existingSpot = await touristSpot_1.TouristSpot.findById(touristSpotId);
        if (!existingSpot) {
            res.status(404).json({ success: false, message: "Tourist spot not found." });
            return;
        }
        if (city && city.toString() !== existingSpot.city.toString()) {
            const oldCity = await city_1.City.findById(existingSpot.city);
            const newCity = await city_1.City.findById(city);
            if (!newCity) {
                res.status(404).json({ success: false, message: "New city not found." });
                return;
            }
            if (oldCity) {
                oldCity.touristSpot = oldCity.touristSpot.filter((id) => id.toString() !== existingSpot._id.toString());
                await oldCity.save();
            }
            newCity.touristSpot.push(existingSpot._id);
            await newCity.save();
            existingSpot.city = newCity._id;
        }
        if (name)
            existingSpot.name = name;
        if (description)
            existingSpot.description = description;
        if (history)
            existingSpot.history = history;
        if (gallery)
            existingSpot.gallery = gallery;
        if (latitude !== undefined || longitude !== undefined) {
            const currentCoords = existingSpot.location?.coordinates ?? [0, 0];
            const newLongitude = longitude !== undefined ? parseFloat(longitude) : currentCoords[0];
            const newLatitude = latitude !== undefined ? parseFloat(latitude) : currentCoords[1];
            existingSpot.location = {
                type: "Point",
                coordinates: [newLongitude, newLatitude],
            };
        }
        await existingSpot.save();
        return res.status(200).json({
            success: true, message: "Tourist spot updated successfully!", touristSpot: existingSpot
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "*Internal server error"
        });
    }
};
exports.updateTouristSpot = updateTouristSpot;
const deleteTouristSpot = async (req, res) => {
    try {
        const { touristSpotId } = req.params;
        const touristSpot = await touristSpot_1.TouristSpot.findById(touristSpotId);
        if (!touristSpot) {
            res.status(404).json({
                success: false, message: "Tourist spot not found."
            });
            return;
        }
        const city = await city_1.City.findById(touristSpot.city);
        if (city) {
            city.touristSpot = city.touristSpot.filter((id) => id.toString() !== touristSpotId);
            await city.save();
        }
        await touristSpot_1.TouristSpot.findByIdAndDelete(touristSpotId);
        return res.status(200).json({
            success: true, message: "Tourist spot deleted successfully!"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal server error."
        });
    }
};
exports.deleteTouristSpot = deleteTouristSpot;
const addBusiness = async (req, res) => {
    try {
        const { name, category, description, address, phone, email, website, hours, latitude, longitude, status, gallery } = req.body;
        const existingBusiness = await business_1.Business.findOne({ email });
        if (existingBusiness) {
            res.status(400).json({
                success: false, message: "A business with this email already exists."
            });
            return;
        }
        const location = {
            type: "Point",
            coordinates: [
                longitude !== undefined ? parseFloat(longitude) : 0,
                latitude !== undefined ? parseFloat(latitude) : 0
            ]
        };
        const newBusiness = await business_1.Business.create({
            name, category, description, address, phone, email,
            website, hours, location, status, gallery
        });
        res.status(201).json({
            success: true, message: "Business created successfully!", business: newBusiness
        });
    }
    catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal server error"
        });
    }
};
exports.addBusiness = addBusiness;
const updateBusiness = async (req, res) => {
    try {
        const { businessId } = req.params;
        const { name, category, description, address, phone, email, website, hours, latitude, longitude, status, gallery } = req.body;
        const existingBusiness = await business_1.Business.findById(businessId);
        if (!existingBusiness) {
            res.status(404).json({
                success: false, message: "Business not found."
            });
            return;
        }
        if (email && email !== existingBusiness.email) {
            const emailTaken = await business_1.Business.findOne({ email });
            if (emailTaken) {
                res.status(400).json({
                    success: false, message: "A business with this email already exists."
                });
                return;
            }
        }
        if ("hours" in req.body) {
            const { error } = business_2.businessHoursValidation.validate({ hours }, { abortEarly: false });
            if (error) {
                res.status(400).json({
                    success: false, message: error.details.map(d => d.message).join(", "), errors: error.details.map(d => d.message)
                });
                return;
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
        existingBusiness.status = status ?? existingBusiness.status;
        existingBusiness.gallery = gallery ?? existingBusiness.gallery;
        if (latitude !== undefined || longitude !== undefined) {
            const currentCoords = existingBusiness.location?.coordinates || [0, 0];
            existingBusiness.location = {
                type: "Point",
                coordinates: [
                    longitude !== undefined ? parseFloat(longitude) : currentCoords[0],
                    latitude !== undefined ? parseFloat(latitude) : currentCoords[1],
                ]
            };
        }
        await existingBusiness.save();
        res.status(200).json({
            success: true, message: "Business updated successfully!", business: existingBusiness
        });
    }
    catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal server error"
        });
    }
};
exports.updateBusiness = updateBusiness;
const deleteBusiness = async (req, res) => {
    try {
        const { businessId } = req.params;
        const existingBusiness = await business_1.Business.findById(businessId);
        if (!existingBusiness) {
            res.status(404).json({
                success: false, message: "Business not found."
            });
            return;
        }
        await existingBusiness.deleteOne();
        res.status(200).json({
            success: true, message: "Business deleted successfully!",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "Internal server error",
        });
    }
};
exports.deleteBusiness = deleteBusiness;
