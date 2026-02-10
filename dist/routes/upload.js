"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multerConfig_1 = __importDefault(require("../middleware/multerConfig"));
const upload_1 = require("../controllers/upload");
const router = (0, express_1.Router)();
router.post("/single", multerConfig_1.default.single("image"), upload_1.uploadImage);
router.post("/multiple", multerConfig_1.default.array("images", 10), upload_1.uploadMultipleImages);
router.post("/media", multerConfig_1.default.fields([{ name: "images", maxCount: 10 }, { name: "videos", maxCount: 3 }]), upload_1.uploadMedia);
exports.default = router;
