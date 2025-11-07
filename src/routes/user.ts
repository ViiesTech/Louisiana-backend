import { Router } from "express";
import { IsAuth } from "../middleware/isAuth";
import { addCityReview, deleteCityReview, getCities, updateCityReview } from "../controllers/user";
import { validate } from "../middleware/validate";
import { cityReviewValidation } from "../validations/user";

const router = Router()

router.get("/getCities", IsAuth, getCities);
router.get("/getCity/:cityId", IsAuth, getCities);
router.post("/addCityReview/:cityId", IsAuth, validate(cityReviewValidation), addCityReview);
router.put("/updateCityReview/:reviewId", IsAuth, validate(cityReviewValidation), updateCityReview);
router.delete("/deleteCityReview/:reviewId", IsAuth, deleteCityReview);

export default router