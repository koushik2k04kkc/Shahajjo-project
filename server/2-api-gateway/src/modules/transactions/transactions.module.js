import express from "express";
import { authenticate } from "../auth/guards/jwt-auth.guard.js";
import { enforceProviderBoundary } from "../auth/guards/provider-boundary.guard.js";
import { createTransaction, getAgentTransactions } from "./transactions.controller.js";

const router = express.Router();
router.use(authenticate);
router.post("/", enforceProviderBoundary, createTransaction);
router.get("/agent/:agentId", getAgentTransactions);

export default router;