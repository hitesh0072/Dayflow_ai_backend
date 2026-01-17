import express from "express";
import * as authController from "./auth.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";

const router = express.Router();

router.post(
  "/register",
  upload.single("profileImage"),
  authController.register,
);
router.post("/verify-email", authController.verifyEmail);
router.post("/login", authController.login);
router.get("/check-username", authController.checkUsername);
router.patch(
  "/update-profile",
  protect,
  upload.single("profileImage"),
  authController.updateProfile,
);
router.post("/resend-otp", authController.resendOtp);
router.get("/logout", protect, authController.logout);

export default router;
