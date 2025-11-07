import { Router } from "express";
import upload from "../middleware/multerConfig";
import { uploadImage, uploadMedia, uploadMultipleImages } from "../controllers/upload";

const router = Router();

router.post("/single", upload.single("image"), uploadImage);
router.post("/multiple", upload.array("images", 10), uploadMultipleImages);
router.post("/media", upload.fields([{ name: "images", maxCount: 10 }, { name: "videos", maxCount: 3 }]), uploadMedia);
export default router;
