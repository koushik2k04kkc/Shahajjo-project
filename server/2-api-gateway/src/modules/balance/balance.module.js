import express from "express";
import { authenticate } from "../auth/guards/jwt-auth.guard.js";
import { getAgentBalances, getAllAgentBalances } from "./balance.controller.js";

const router = express.Router();
router.use(authenticate);
router.get("/agent/:agentId", getAgentBalances);
router.get("/", getAllAgentBalances);

export default router;