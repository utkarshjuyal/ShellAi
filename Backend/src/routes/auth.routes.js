import { Router } from "express";

import {
  deleteUser,
  getMe,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";

import { authUser } from "../middlewares/auth.middleware.js";

import {
  loginValidator,
  registerValidator,
} from "../validators/auth.validator.js";

import {
  deleteAccountLimiter,
  loginLimiter,
  logoutLimiter,
  registerLimiter,
} from "../middlewares/rateLimiter.middleware.js";

const authRouter = Router();

// Public Routes

authRouter.post(
  "/register",
  registerLimiter,
  registerValidator,
  register,
);

authRouter.post(
  "/login",
  loginLimiter,
  loginValidator,
  login,
);

authRouter.post(
  "/logout",
  logoutLimiter,
  logout,
);

// Protected Routes

authRouter.get(
  "/get-me",
  authUser,
  getMe,
);

authRouter.delete(
  "/delete-account",
  authUser,
  deleteAccountLimiter,
  deleteUser,
);

export default authRouter;