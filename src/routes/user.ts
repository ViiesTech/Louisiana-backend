import { Router } from "express";
import { IsAuth } from "../middleware/isAuth";
import { addBusinessReview, addCityReview, createItinerary, deleteBusinessReview, deleteCityReview, deleteItinerary, getBusiness, getCities, getTouristSpots, getUser, toggleFavouriteBusiness, toggleFavouriteCities, toggleVisitedCities, updateBusinessReview, updateCityReview, updateItinerary } from "../controllers/user";
import { validate } from "../middleware/validate";
import { cityReviewValidation, createItineraryValidation } from "../validations/user";

const router = Router()

router.get("/cities/all", IsAuth, getCities);
router.get("/city/:cityId", IsAuth, getCities);

router.get("/touristSpots/all", IsAuth, getTouristSpots);
router.get("/touristSpot/:touristSpotId", IsAuth, getTouristSpots);

router.get("/businesses/all", IsAuth, getBusiness);
router.get("/business/:businessId", IsAuth, getBusiness);

router.post("/city/review/add/:cityId", IsAuth, validate(cityReviewValidation), addCityReview);
router.put("/city/review/update/:reviewId", IsAuth, validate(cityReviewValidation), updateCityReview);
router.delete("/city/review/delete/:reviewId", IsAuth, deleteCityReview);

router.post("/business/review/add/:businessId", IsAuth, validate(cityReviewValidation), addBusinessReview);
router.put("/business/review/update/:reviewId", IsAuth, validate(cityReviewValidation), updateBusinessReview);
router.delete("/business/review/delete/:reviewId", IsAuth, deleteBusinessReview);

router.patch("/city/favourite/:cityId", IsAuth, toggleFavouriteCities);
router.patch("/business/favourite/:businessId", IsAuth, toggleFavouriteBusiness);
router.patch("/city/visited/:cityId", IsAuth, toggleVisitedCities);

router.get("/", IsAuth, getUser);

router.post("/itinerary/create", IsAuth, validate(createItineraryValidation), createItinerary);
router.put("/itinerary/update/:itineraryId", IsAuth, updateItinerary);
router.delete("/itinerary/delete/:itineraryId", IsAuth, deleteItinerary);

export default router