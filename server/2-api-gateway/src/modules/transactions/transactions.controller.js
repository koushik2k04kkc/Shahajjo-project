import { query } from "../../database/database.module.js";
import { analyzeAgent } from "../../utils/apiClient.js";
import { createAlert } from "../alert-router/alert-router.service.js";
import { dispatchAlert } from "../notification-gateway/notification.service.js";
import { logAction } from "../audit-log/audit-log.service.js";

export const createTransaction = async (req, res, next) => {
  const { agent_id, provider_id, transaction_type, amount, customer_ref_hash } = req.body;
  const user = req.user;

  try {
    const txResult = await query(
      `INSERT INTO transactions (id, agent_id, provider_id, transaction_type, amount, status, customer_ref_hash, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, 'completed', $5, NOW()) RETURNING *`,
      [agent_id, provider_id, transaction_type, amount, customer_ref_hash],
      req.providerContext
    );
    const transaction = txResult.rows[0];

    const balanceResult = await query("SELECT * FROM agent_provider_balances WHERE agent_id = $1", [agent_id], req.providerContext);
    const recentTxResult = await query(
      `SELECT * FROM transactions WHERE agent_id = $1 AND created_at > NOW() - INTERVAL '4 hours' ORDER BY created_at DESC`,
      [agent_id],
      req.providerContext
    );

    const analysis = await analyzeAgent(agent_id, recentTxResult.rows, balanceResult.rows);
    let alerts = [];

    if (analysis.anomalies?.length > 0 || analysis.projections?.some((p) => p.confidence > 0.6)) {
      alerts = await createAlert(analysis, agent_id, user);
      for (const alert of alerts) {
        dispatchAlert(alert, { id: alert.caseId });
      }
    }

    await logAction(null, "transaction_created", user.role, user.id, { transaction_id: transaction.id, amount, provider_id, analysis_status: analysis.status }, req.providerContext);

    res.status(201).json({ transaction, analysis: { status: analysis.status, data_quality_score: analysis.data_quality_score, alerts_generated: alerts.length, alerts } });
  } catch (err) { next(err); }
};

export const getAgentTransactions = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT * FROM transactions WHERE agent_id = $1 ORDER BY created_at DESC LIMIT 100`,
      [req.params.agentId],
      req.providerContext
    );
    res.json(result.rows);
  } catch (err) { next(err); }
};