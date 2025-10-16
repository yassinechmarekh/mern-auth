import { Router } from "express";
import {
  forgotPasswordController,
  getProfileDataController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendEmailVerificationController,
  resetPasswordController,
  verifyAccessTokenController,
  verifyEmailControler,
  verifyResetPasswordTokenController,
} from "../controllers/auth.controller";
import {
  validateBody,
  validateObjectId,
} from "../middlewares/validation.middleware";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../utils/schemas/auth.schema";
import { isAuthenticated } from "../middlewares/auth.middleware";

const router = Router();

// ~/api/auth/register
router
  .route("/register")
  .post(validateBody(registerSchema), registerController);

// ~/api/auth/verify-email/:userId
router
  .route("/verify-email/:userId")
  .post(
    validateObjectId("userId"),
    validateBody(verifyEmailSchema),
    verifyEmailControler
  );

// ~/api/auth/resend-otp/:userId
router
  .route("/resend-otp/:userId")
  .get(validateObjectId("userId"), resendEmailVerificationController);

// ~/api/auth/forgot-password
router
  .route("/forgot-password")
  .post(validateBody(forgotPasswordSchema), forgotPasswordController);

// ~/api/auth/reset-password/:token
router
  .route("/reset-password/:token")
  .post(validateBody(resetPasswordSchema), resetPasswordController);

// ~/api/auth/verify-reset-password-token/:token
router
  .route("/verify-reset-password-token/:token")
  .get(verifyResetPasswordTokenController);

// ~/api/auth/login
router.route("/login").post(validateBody(loginSchema), loginController);

// ~/api/auth/profile-data
router.route("/profile-data").get(isAuthenticated, getProfileDataController);

// ~/api/auth/logout
router.route("/logout").get(logoutController);

// ~/api/auth/refresh
router.route("/refresh").get(refreshTokenController);

// ~/api/auth/verify-token
router.route("/verify-token").get(verifyAccessTokenController);

export default router;
