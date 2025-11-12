import Joi from "joi";

export const cityReviewValidation = Joi.object({
    rating: Joi.number().min(1).max(5).required().messages({
        "number.base": "Rating must be a number.",
        "number.min": "Rating must be at least 1.",
        "number.max": "Rating cannot be more than 5.",
        "any.required": "Rating is required."
    }),
    comment: Joi.string().required().messages({
        "string.base": "Comment must be a string.",
        "string.empty": "Comment cannot be empty.",
        "any.required": "Comment is required."
    })
});

export const createItineraryValidation = Joi.object({
    title: Joi.string().required().messages({
        "string.base": "Title must be a string.",
        "string.empty": "Title cannot be empty.",
        "any.required": "Title is required."
    }),
    description: Joi.string().optional().messages({
        "string.base": "Description must be a string."
    }),
    startDate: Joi.string().required().messages({
        "string.base": "Start date must be a string.",
        "string.empty": "Start date cannot be empty.",
        "any.required": "Start date is required."
    }),
    endDate: Joi.string().required().messages({
        "string.base": "End date must be a string.",
        "string.empty": "End date cannot be empty.",
        "any.required": "End date is required."
    }),
    places: Joi.array().items(
        Joi.object({
            placeId: Joi.string().required().messages({
                "string.base": "Place ID must be a string.",
                "string.empty": "Place ID cannot be empty.",
                "any.required": "Place ID is required."
            }),
            placeModel: Joi.string().required().messages({
                "string.base": "Place model must be a string.",
                "string.empty": "Place model cannot be empty.",
                "any.required": "Place model is required."
            })
        })
    ).required().messages({
        "array.base": "Places must be an array.",
        "any.required": "Places are required."
    })
});
