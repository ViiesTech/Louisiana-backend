"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMedia = exports.uploadMultipleImages = exports.uploadImage = void 0;
const createUrl_1 = require("../utils/createUrl");
const createUrls_1 = require("../utils/createUrls");
const uploadImage = (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: "*No image uploaded" });
            return;
        }
        const profileUrl = (0, createUrl_1.createUrl)(req, req.file, "image");
        res.status(200).json({ success: true, message: 'Image upload successfully', link: profileUrl });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
};
exports.uploadImage = uploadImage;
const uploadMultipleImages = async (req, res) => {
    try {
        if (!Array.isArray(req.files) || req.files.length === 0) {
            res.status(400).json({ success: false, message: "*No images uploaded" });
            return;
        }
        const fileLinks = (0, createUrls_1.createUrls)(req, req.files, "images");
        res.status(200).json({ success: true, message: 'Images upload successfully', links: fileLinks });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
};
exports.uploadMultipleImages = uploadMultipleImages;
const uploadMedia = async (req, res) => {
    try {
        const files = req.files;
        const images = files?.["images"] || [];
        const videos = files?.["videos"] || [];
        if (images.length === 0 && videos.length === 0) {
            return res.status(400).json({
                success: false, message: "*No media files uploaded",
            });
        }
        const imageLinks = (0, createUrls_1.createUrls)(req, images, "images");
        const videoLinks = (0, createUrls_1.createUrls)(req, videos, "videos");
        res.status(200).json({
            success: true,
            message: "Media uploaded successfully",
            data: {
                images: imageLinks,
                videos: videoLinks,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "*Internal server error",
        });
    }
};
exports.uploadMedia = uploadMedia;
