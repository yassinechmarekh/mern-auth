import { Router } from "express";
import {
  registerController,
  resendEmailVerificationController,
  verifyEmailControler,
} from "../controllers/auth.controller";
import {
  validateBody,
  validateObjectId,
} from "../middlewares/validation.middleware";
import {
  registerSchema,
  verifyEmailSchema,
} from "../utils/schemas/auth.schema";

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

export default router;
