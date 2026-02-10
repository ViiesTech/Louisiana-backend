"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTouristSpotValidation = exports.addCityValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.addCityValidation = joi_1.default.object({
    name: joi_1.default.string().trim().required().messages({
        "string.base": "Name must be a string.",
        "string.empty": "Name is required.",
        "any.required": "City name is required.",
    }),
    type: joi_1.default.string().required().messages({
        "any.required": "Type is required.",
    }),
    description: joi_1.default.string().trim().required().messages({
        "any.required": "Description is required.",
        "string.max": "Description cannot exceed 1000 characters.",
    }),
    history: joi_1.default.string().trim().required().messages({
        "any.required": "history is required.",
    }),
    address: joi_1.default.string().trim().required().messages({
        "any.required": "address is required.",
    }),
    phone: joi_1.default.string().pattern(/^[0-9]{7,15}$/).required().messages({
        "any.required": "Phone number is required.",
        "string.pattern.base": "Phone number must contain 7–15 digits.",
    }),
    website: joi_1.default.string().uri().required().messages({
        "string.uri": "Website must be a valid URL.",
        "any.required": "Website is required.",
    }),
    hours: joi_1.default.string().trim().required().messages({
        "string.base": "Hours must be a string like '9:00 AM - 5:00 PM'.",
        "any.required": "Hours is required.",
    }),
    latitude: joi_1.default.number().required().messages({
        "number.base": "Latitude must be a number.",
        "any.required": "Latitude is required.",
    }),
    longitude: joi_1.default.number().required().messages({
        "number.base": "Longitude must be a number.",
        "any.required": "Longitude is required.",
    }),
    gallery: joi_1.default.array().items(joi_1.default.string().uri()).default([]).messages({
        "array.base": "Gallery must be an array of URLs.",
        "string.uri": "Each gallery item must be a valid URL.",
    }),
});
exports.addTouristSpotValidation = joi_1.default.object({
    name: joi_1.default.string().trim().required().messages({
        "string.base": "Name must be a string.",
        "string.empty": "Name is required.",
        "any.required": "Tourist spot name is required.",
    }),
    city: joi_1.default.string().hex().required().messages({
        "string.hex": "City ID must be a valid ObjectId.",
        "any.required": "City is required.",
    }),
    description: joi_1.default.string().trim().optional().allow("").messages({
        "string.base": "Description must be a string.",
    }),
    history: joi_1.default.string().trim().optional().allow("").messages({
        "string.base": "History must be a string.",
    }),
    latitude: joi_1.default.number().required().messages({
        "number.base": "Latitude must be a number.",
        "any.required": "Latitude is required.",
    }),
    longitude: joi_1.default.number().required().messages({
        "number.base": "Longitude must be a number.",
        "any.required": "Longitude is required.",
    }),
    gallery: joi_1.default.array().items(joi_1.default.string().uri().messages({
        "string.uri": "Each gallery item must be a valid URL.",
    })).required().messages({
        "array.base": "Gallery must be an array of URLs.",
        "any.required": "Gallery is required.",
    }),
});
