import { Request, Response } from "express";
import { port } from "../config/env";
import { getLocalIp } from "../utils/getLocalIp";

const ip = getLocalIp()

export const uploadImage = (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: "*No image uploaded" });
            return
        }

        const baseUrl = ip ? `http://${ip}:${port}` : `http://localhost:${port}`;

        const fileLink = `${baseUrl}/uploads/${req.file.filename}`;

        res.status(200).json({ success: true, message: 'Image upload successfully', link: fileLink });
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

        const baseUrl = ip ? `http://${ip}:${port}` : `http://localhost:${port}`;

        const fileLinks = req.files.map(
            (file: Express.Multer.File) => `${baseUrl}/uploads/${file.filename}`
        );

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

        const baseUrl = ip ? `http://${ip}:${port}` : `http://localhost:${port}`;

        const imageLinks = images.map(
            (file) => `${baseUrl}/uploads/${file.filename}`
        );

        const videoLinks = videos.map(
            (file) => `${baseUrl}/uploads/${file.filename}`
        );

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
