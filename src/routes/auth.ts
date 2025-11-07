import { Router } from "express";
import { forgotPassword, loginAsGuest, resetPassword, signin, signup, verifyOtp } from "../controllers/auth";
import { validate } from "../middleware/validate";
import { forgotPasswordValidation, guestValidation, resetPasswordValidation, signinValidation, signupValidation, verifyOtpValidation } from "../validations/auth";
import upload from "../middleware/multerConfig";

const router = Router()

router.post('/signup', upload.single("profile"), validate(signupValidation), signup)
router.post('/signin', validate(signinValidation), signin)
router.post('/forgotPassword', validate(forgotPasswordValidation), forgotPassword)
router.post('/verifyOtp', validate(verifyOtpValidation), verifyOtp)
router.post('/resetPassword', validate(resetPasswordValidation), resetPassword)
router.post('/loginAsGuest', validate(guestValidation), loginAsGuest)


export default router