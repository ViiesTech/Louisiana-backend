"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveUploads = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
/**
 * Middleware for serving uploaded images and videos
 */
exports.serveUploads = express_1.default.static(path_1.default.join(__dirname, "../../uploads"), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith(".mp4")) {
            res.setHeader("Content-Type", "video/mp4");
        }
        else if (filePath.endsWith(".mov")) {
            res.setHeader("Content-Type", "video/quicktime");
        }
        else if (filePath.endsWith(".webm")) {
            res.setHeader("Content-Type", "video/webm");
        }
        else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
            res.setHeader("Content-Type", "image/jpeg");
        }
        else if (filePath.endsWith(".png")) {
            res.setHeader("Content-Type", "image/png");
        }
    },
});
