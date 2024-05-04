import express from 'express';
import { signup,resetPasswordToken,resetPassword } from '../controllers/auth.controller.js';
import {signin,google} from '../controllers/auth.controller.js';
const router = express.Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.post('/google',google);
router.post("/reset-password-token", resetPasswordToken)                 // Route for generating a reset password token
router.post("/reset-password", resetPassword)                          // Route for resetting user's password after verification
export default router;