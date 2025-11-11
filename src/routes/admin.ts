import { Router } from "express";
import { addBusiness, addCity, addTouristSpot, deleteBusiness, deleteTouristSpot, updateBusiness, updateCity, updateTouristSpot } from "../controllers/admin";
import { validate } from "../middleware/validate";
import { addCityValidation, addTouristSpotValidation } from "../validations/admin";
import { adminSignin, adminSignup } from "../controllers/auth";
import { signinValidation } from "../validations/auth";
import { IsAuth } from "../middleware/isAuth";
import { addBusinessValidation } from "../validations/business";

const router = Router();

// router.post("/signup", adminSignup);
router.post("/signin", validate(signinValidation), adminSignin);

router.post("/city/add", IsAuth, validate(addCityValidation), addCity);
router.put("/city/update/:cityId", IsAuth, updateCity);

router.post("/touristSpot/add", IsAuth, validate(addTouristSpotValidation), addTouristSpot);
router.put("/touristSpot/update/:touristSpotId", IsAuth, updateTouristSpot);
router.delete("/touristSpot/delete/:touristSpotId", IsAuth, deleteTouristSpot);

router.post("/business/add", IsAuth, validate(addBusinessValidation), addBusiness);
router.put("/business/update/:businessId", IsAuth, updateBusiness);
router.delete("/business/delete/:businessId", IsAuth, deleteBusiness);

export default router;
