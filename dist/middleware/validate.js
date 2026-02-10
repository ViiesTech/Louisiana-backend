"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => (req, res, next) => {
    const contentType = req.headers["content-type"] || "";
    const isAllowedType = contentType.includes("application/json") ||
        contentType.includes("multipart/form-data");
    if (["POST", "PUT", "PATCH"].includes(req.method) && !isAllowedType) {
        return res.status(415).json({
            success: false,
            message: "*Unsupported Media Type. Expected 'application/json' or 'multipart/form-data'.",
        });
    }
    if (!Object.keys(req.body || {}).length) {
        return res.status(400).json({
            success: false,
            message: "*Request body cannot be empty.",
        });
    }
    if (req.is("multipart/form-data")) {
        for (const key in req.body) {
            try {
                req.body[key] = JSON.parse(req.body[key]);
            }
            catch { }
        }
    }
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
            errors: error.details.map((d) => d.message),
        });
    }
    next();
};
exports.validate = validate;
