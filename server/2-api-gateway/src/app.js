import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import authRoutes from "./modules/auth/auth.module.js";
import transactionRoutes from "./modules/transactions/transactions.module.js";
import balanceRoutes from "./modules/balance/balance.module.js";
import alertRoutes from "./modules/alert-router/alert-router.module.js";
import caseRoutes from "./modules/case-management/case.module.js";
import auditRoutes from "./modules/audit-log/audit-log.module.js";
import { errorHandler } from "./common/filters/http-exception.filter.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(compression());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), service: "api-gateway" });
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/balances", balanceRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/audit", auditRoutes);

app.use(errorHandler);

export default app;