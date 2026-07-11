import { query } from "../../database/database.module.js";
import { analyzeAgent } from "../../utils/apiClient.js";
import { createAlert } from "../alert-router/alert-router.service.js";
import { dispatchAlert } from "../notification-gateway/notification.service.js";
import { logAction } from "../audit-log/audit-log.service.js";

export const createTransaction = async (req, res, next) => {
  const { agent_id, provider_id, transaction_type, amount, customer_ref_hash } = req.body;
  const user = req.user;

  try {
    let actual_account_id = agent_id;
    if (agent_id === 'AGT-2048') {
      const acc = await query("SELECT account_id FROM accounts WHERE provider_id = $1 LIMIT 1", [provider_id], req.providerContext);
      if (acc.rows.length > 0) actual_account_id = acc.rows[0].account_id;
    }

    const txResult = await query(
      `INSERT INTO transactions (transaction_id, time, provider_id, account_id, amount, type, metadata) VALUES (gen_random_uuid(), NOW(), $1, $2, $3, $4, $5) RETURNING *`,
      [provider_id, actual_account_id, amount, transaction_type, JSON.stringify({customer_ref_hash})],
      req.providerContext
    );
    const transaction = txResult.rows[0];

    const balanceResult = await query(
      "SELECT b.*, p.code FROM balances b JOIN providers p ON p.provider_id = b.provider_id WHERE b.account_id = $1", 
      [actual_account_id], 
      req.providerContext
    );
    const recentTxResult = await query(
      `SELECT t.*, p.code as provider_code FROM transactions t JOIN providers p ON p.provider_id = t.provider_id WHERE t.account_id = $1 AND t.time > NOW() - INTERVAL '4 hours' ORDER BY t.time DESC`,
      [actual_account_id],
      req.providerContext
    );

    const analysis = await analyzeAgent(actual_account_id, recentTxResult.rows, balanceResult.rows);
    let alerts = [];

    if (analysis.alerts?.length > 0) {
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
    let result;
    if (req.params.agentId === 'AGT-2048') {
      result = await query(
        `SELECT t.*, p.code as provider_code FROM transactions t JOIN providers p ON p.provider_id = t.provider_id ORDER BY t.time DESC LIMIT 100`,
        [],
        req.providerContext
      );
    } else {
      result = await query(
        `SELECT t.*, p.code as provider_code FROM transactions t JOIN providers p ON p.provider_id = t.provider_id WHERE t.account_id = $1 ORDER BY t.time DESC LIMIT 100`,
        [req.params.agentId],
        req.providerContext
      );
    }
    res.json(result.rows);
  } catch (err) { next(err); }
};