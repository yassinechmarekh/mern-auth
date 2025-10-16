import { Router } from "express";
import {
  forgotPasswordController,
  getProfileDataController,
  googleCallbackController,
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
import passport from "../config/passport";

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

// ~/api/auth/google
router.route("/google").get(
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  })
);

// ~/api/auth/google/callback
router.route("/google/callback").get(
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/google/failure",
  }),
  googleCallbackController
);

// ~/api/auth/google/failure
router.route("/google/failure").get((req, res) => {
  res.status(401).json({ message: "Google authentication failed" });
});

export default router;
