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
import { authenticate } from "./modules/auth/guards/jwt-auth.guard.js";
import { getAgentOverview } from "./modules/balance/balance.controller.js";
import { errorHandler } from "./common/filters/http-exception.filter.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(compression());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 10000, standardHeaders: true, legacyHeaders: false }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get(["/health", "/api/v1/health"], (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), service: "api-gateway" });
});

const apiV1 = express.Router();
apiV1.use("/auth", authRoutes);
apiV1.use("/transactions", transactionRoutes);
apiV1.use("/balances", balanceRoutes);
apiV1.use("/alerts", alertRoutes);
apiV1.use("/cases", caseRoutes);
apiV1.use("/audit", auditRoutes);
apiV1.get("/agents/:agentId/overview", authenticate, getAgentOverview);
apiV1.get("/agents/:agentId/liquidity", authenticate, async (req, res, next) => {
  try {
    const { query: dbQuery } = await import("./database/database.module.js");
    const result = await dbQuery(
      `SELECT
         date_trunc('hour', t.time) AS hour,
         SUM(CASE WHEN t.type = 'cash_in' OR t.type = 'buy_float' THEN t.amount ELSE 0 END) AS inflow,
         SUM(CASE WHEN t.type = 'cash_out' OR t.type = 'p2p' THEN t.amount ELSE 0 END) AS outflow
       FROM transactions t
       WHERE t.time > NOW() - INTERVAL '24 hours'
       GROUP BY hour ORDER BY hour`,
      [],
      req.providerContext
    );
    const series = result.rows.map((r) => ({
      time: r.hour,
      inflow: Number(r.inflow || 0),
      outflow: Number(r.outflow || 0),
      net: Number(r.inflow || 0) - Number(r.outflow || 0),
    }));
    res.json({ agentId: req.params.agentId, series });
  } catch (err) { next(err); }
});

app.use("/api/v1", apiV1);

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/balances", balanceRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/audit", auditRoutes);

app.use(errorHandler);

export default app;
