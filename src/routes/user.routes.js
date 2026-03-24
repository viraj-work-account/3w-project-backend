import { Router } from "express";
import {
  signup,
  login,
  logout,
  refreshAccessToken,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login);

// protected routes
router.route("/logout").post(verifyJWT, logout);
router.route("/refresh-token").post(verifyJWT, refreshAccessToken);

export default router;
