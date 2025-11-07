import express from "express";
import path from "path";

/**
 * Middleware for serving uploaded images and videos
 */
export const serveUploads = express.static(path.join(__dirname, "../../uploads"), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".mp4")) {
      res.setHeader("Content-Type", "video/mp4");
    } else if (filePath.endsWith(".mov")) {
      res.setHeader("Content-Type", "video/quicktime");
    } else if (filePath.endsWith(".webm")) {
      res.setHeader("Content-Type", "video/webm");
    } else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
      res.setHeader("Content-Type", "image/jpeg");
    } else if (filePath.endsWith(".png")) {
      res.setHeader("Content-Type", "image/png");
    }
  },
});
