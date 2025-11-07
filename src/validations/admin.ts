import Joi from "joi";

export const addCityValidation = Joi.object({
    name: Joi.string().trim().required().messages({
        "string.base": "Name must be a string.",
        "string.empty": "Name is required.",
        "any.required": "City name is required.",
    }),

    type: Joi.string().required().messages({
        "any.required": "Type is required.",
    }),

    description: Joi.string().trim().required().messages({
        "any.required": "Description is required.",
        "string.max": "Description cannot exceed 1000 characters.",
    }),

    history: Joi.string().trim().required().messages({
        "any.required": "history is required.",
    }),

    address: Joi.string().trim().required().messages({
        "any.required": "address is required.",
    }),

    phone: Joi.string().pattern(/^[0-9]{7,15}$/).required().messages({
        "any.required": "Phone number is required.",
        "string.pattern.base": "Phone number must contain 7–15 digits.",
    }),

    website: Joi.string().uri().required().messages({
        "string.uri": "Website must be a valid URL.",
        "any.required": "Website is required.",
    }),

    hours: Joi.string().trim().required().messages({
        "string.base": "Hours must be a string like '9:00 AM - 5:00 PM'.",
        "any.required": "Hours is required.",
    }),

    latitude: Joi.number().required().messages({
        "number.base": "Latitude must be a number.",
        "any.required": "Latitude is required.",
    }),

    longitude: Joi.number().required().messages({
        "number.base": "Longitude must be a number.",
        "any.required": "Longitude is required.",
    }),

    gallery: Joi.array().items(Joi.string().uri()).default([]).messages({
        "array.base": "Gallery must be an array of URLs.",
        "string.uri": "Each gallery item must be a valid URL.",
    }),
});

export const addTouristSpotValidation = Joi.object({
    name: Joi.string().trim().required().messages({
        "string.base": "Name must be a string.",
        "string.empty": "Name is required.",
        "any.required": "Tourist spot name is required.",
    }),

    city: Joi.string().hex().required().messages({
        "string.hex": "City ID must be a valid ObjectId.",
        "any.required": "City is required.",
    }),

    description: Joi.string().trim().optional().allow("").messages({
        "string.base": "Description must be a string.",
    }),

    history: Joi.string().trim().optional().allow("").messages({
        "string.base": "History must be a string.",
    }),

    latitude: Joi.number().required().messages({
        "number.base": "Latitude must be a number.",
        "any.required": "Latitude is required.",
    }),

    longitude: Joi.number().required().messages({
        "number.base": "Longitude must be a number.",
        "any.required": "Longitude is required.",
    }),

    gallery: Joi.array().items(Joi.string().uri().messages({
        "string.uri": "Each gallery item must be a valid URL.",
    })).required().messages({
        "array.base": "Gallery must be an array of URLs.",
        "any.required": "Gallery is required.",
    }),
});
