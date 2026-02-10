"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUrl = void 0;
const createUrl = (req, file, bodyKey) => {
    if (file) {
        const protocol = req.protocol;
        const host = req.get("host");
        const normalizedPath = file.path.replace(/\\/g, "/");
        return `${protocol}://${host}/${normalizedPath}`;
    }
    if (bodyKey && typeof req.body?.[bodyKey] === "string") {
        return req.body[bodyKey];
    }
    return "";
};
exports.createUrl = createUrl;
