import Joi from "joi";

export const addBusinessValidation = Joi.object({
    name: Joi.string().trim().required().messages({
        "string.base": "Name must be a string.",
        "string.empty": "Name is required.",
        "any.required": "Name is required.",
    }),

    category: Joi.string().trim().required().messages({
        "string.base": "Category must be a string.",
        "string.empty": "Category is required.",
        "any.required": "Category is required.",
    }),

    description: Joi.string().trim().required().messages({
        "string.base": "Description must be a string.",
        "string.empty": "Description is required.",
        "any.required": "Description is required.",
    }),

    address: Joi.string().trim().required().messages({
        "string.base": "Address must be a string.",
        "string.empty": "Address is required.",
        "any.required": "Address is required.",
    }),

    phone: Joi.number().required().messages({
        "number.base": "Phone must be a number.",
        "any.required": "Phone is required.",
    }),

    email: Joi.string().email().required().messages({
        "string.email": "Email must be a valid email address.",
        "string.empty": "Email is required.",
        "any.required": "Email is required.",
    }),

    website: Joi.string().uri().required().messages({
        "string.uri": "Website must be a valid URL.",
        "string.empty": "Website is required.",
        "any.required": "Website is required.",
    }),

    status: Joi.string().valid("Active", "Inactive").required().messages({
        "any.only": "Status must be either 'Active' or 'Inactive'.",
        "any.required": "Status is required.",
    }),

    latitude: Joi.number().required().messages({
        "number.base": "Latitude must be a number.",
        "any.required": "Latitude is required.",
    }),

    longitude: Joi.number().required().messages({
        "number.base": "Longitude must be a number.",
        "any.required": "Longitude is required.",
    }),

    gallery: Joi.array().items(Joi.string().uri()).required().messages({
        "array.base": "Gallery must be an array of URLs.",
        "string.uri": "Each gallery item must be a valid URL.",
        "any.required": "Gallery is required.",
    }),

    hours: Joi.array().items(
        Joi.object({
            day: Joi.string()
                .valid("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")
                .required()
                .messages({
                    "any.only": "Day must be a valid day of the week.",
                    "any.required": "Day is required.",
                }),
            isClosed: Joi.boolean()
                .required()
                .messages({
                    "boolean.base": "isClosed must be a boolean.",
                    "any.required": "isClosed is required.",
                }),
            open: Joi.string()
                .empty("")
                .when("isClosed", {
                    is: false,
                    then: Joi.required().messages({
                        "any.required": "Open time is required if the business is not closed that day.",
                    }),
                    otherwise: Joi.optional(),
                }),
            close: Joi.string()
                .empty("")
                .when("isClosed", {
                    is: false,
                    then: Joi.required().messages({
                        "any.required": "Close time is required if the business is not closed that day.",
                    }),
                    otherwise: Joi.optional(),
                }),
        })
    ).min(1).required().messages({
        "array.base": "Hours must be an array of objects.",
        "any.required": "Hours are required.",
        "array.min": "At least one hour entry is required.",
    })
})

export const businessHoursValidation = Joi.object({

    hours: Joi.array().items(
        Joi.object({
            day: Joi.string()
                .valid("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")
                .required()
                .messages({
                    "any.only": "Day must be a valid day of the week.",
                    "any.required": "Day is required.",
                }),
            isClosed: Joi.boolean()
                .required()
                .messages({
                    "boolean.base": "isClosed must be a boolean.",
                    "any.required": "isClosed is required.",
                }),
            open: Joi.string()
                .empty("")
                .when("isClosed", {
                    is: false,
                    then: Joi.required().messages({
                        "any.required": "Open time is required if the business is not closed that day.",
                    }),
                    otherwise: Joi.optional(),
                }),
            close: Joi.string()
                .empty("")
                .when("isClosed", {
                    is: false,
                    then: Joi.required().messages({
                        "any.required": "Close time is required if the business is not closed that day.",
                    }),
                    otherwise: Joi.optional(),
                }),
        })
    ).min(1).required().messages({
        "array.base": "Hours must be an array of objects.",
        "any.required": "Hours are required.",
        "array.min": "At least one hour entry is required.",
    })
})
