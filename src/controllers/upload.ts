import { Request, Response } from "express";
import { createUrl } from "../utils/createUrl";
import { createUrls } from "../utils/createUrls";

export const uploadImage = (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: "*No image uploaded" });
            return
        }

        const profileUrl = createUrl(req, req.file, "image");

        res.status(200).json({ success: true, message: 'Image upload successfully', link: profileUrl });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
};

export const uploadMultipleImages = async (req: Request, res: Response) => {
    try {
        if (!Array.isArray(req.files) || req.files.length === 0) {
            res.status(400).json({ success: false, message: "*No images uploaded" });
            return
        }

        const fileLinks = createUrls(req, req.files as Express.Multer.File[], "images");

        res.status(200).json({ success: true, message: 'Images upload successfully', links: fileLinks });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
};

interface MulterFiles {
    [fieldname: string]: Express.Multer.File[];
}

export const uploadMedia = async (req: Request, res: Response) => {
    try {
        const files = req.files as MulterFiles;

        const images = files?.["images"] || [];
        const videos = files?.["videos"] || [];

        if (images.length === 0 && videos.length === 0) {
            return res.status(400).json({
                success: false, message: "*No media files uploaded",
            });
        }

        const imageLinks = createUrls(req, images, "images");
        const videoLinks = createUrls(req, videos, "videos");

        res.status(200).json({
            success: true,
            message: "Media uploaded successfully",
            data: {
                images: imageLinks,
                videos: videoLinks,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                error instanceof Error ? error.message : "*Internal server error",
        });
    }
};
