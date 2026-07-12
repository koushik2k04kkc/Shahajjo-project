import express from "express";
import { authenticate } from "../auth/guards/jwt-auth.guard.js";
import { requireRole } from "../auth/guards/roles.guard.js";
import { getAlerts, getAlertById, acknowledgeAlert, manualEscalate } from "./alert-router.controller.js";

const router = express.Router();
router.use(authenticate);
router.get("/", getAlerts);
router.get("/:id", getAlertById);
router.post("/:id/acknowledge", acknowledgeAlert);
router.post("/:id/escalate", requireRole("ops_team", "risk_analyst", "area_manager"), manualEscalate);

export default router;