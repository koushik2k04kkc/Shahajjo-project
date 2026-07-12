import express from "express";
import { authenticate } from "../auth/guards/jwt-auth.guard.js";
import { requireRole } from "../auth/guards/roles.guard.js";
import { getCases, getCaseById, acknowledgeCase, assignCase, resolveCase } from "./case.controller.js";

const router = express.Router();
router.use(authenticate);
router.get("/", getCases);
router.get("/:caseId", getCaseById);
router.post("/:caseId/acknowledge", acknowledgeCase);
router.post("/:caseId/assign", requireRole("ops_team", "area_manager"), assignCase);
router.post("/:caseId/resolve", resolveCase);

export default router;