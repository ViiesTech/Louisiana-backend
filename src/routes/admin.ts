import { Router } from "express";
import { addCity, addTouristSpot, updateCity } from "../controllers/admin";
import { validate } from "../middleware/validate";
import { addCityValidation, addTouristSpotValidation } from "../validations/admin";
import { adminSignin, adminSignup } from "../controllers/auth";
import { signinValidation } from "../validations/auth";
import { IsAuth } from "../middleware/isAuth";

const router = Router();

// router.post("/signup", adminSignup);
router.post("/signin", validate(signinValidation), adminSignin);

router.post("/addCity", IsAuth, validate(addCityValidation), addCity);
router.put("/updateCity/:cityId", IsAuth, updateCity);

router.post("/addTouristSpot", validate(addTouristSpotValidation), addTouristSpot);

export default router;
