import express from "express";
import { login, register, me } from "./auth.controller.js";
import { authenticate } from "./guards/jwt-auth.guard.js";
import { validateBody } from "../../common/pipes/validation.pipe.js";
import { loginSchema } from "../../config/validation.schema.js";

const router = express.Router();
router.post("/login", validateBody(loginSchema), login);
router.post("/register", register);
router.get("/me", authenticate, me);

export default router;