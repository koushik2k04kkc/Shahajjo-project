import express from "express";
import { authenticate } from "../auth/guards/jwt-auth.guard.js";
import { getAuditLogs } from "./audit-log.controller.js";

const router = express.Router();
router.use(authenticate);
router.get("/case/:caseId", getAuditLogs);

export default router;