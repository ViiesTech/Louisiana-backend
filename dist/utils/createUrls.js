"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUrls = void 0;
const createUrls = (req, files, bodyKey) => {
    if (files && files.length > 0) {
        const protocol = req.protocol;
        const host = req.get("host");
        return files.map(file => {
            const normalizedPath = file.path.replace(/\\/g, "/");
            return `${protocol}://${host}/${normalizedPath}`;
        });
    }
    if (bodyKey && Array.isArray(req.body?.[bodyKey])) {
        return req.body[bodyKey];
    }
    return [];
};
exports.createUrls = createUrls;
