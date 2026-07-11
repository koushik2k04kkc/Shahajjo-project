import { query } from "../../database/database.module.js";

export const getAlerts = async (req, res, next) => {
  try {
    const { status, severity, agent_id } = req.query;
    let sql = "SELECT * FROM anomaly_alerts WHERE 1=1";
    const params = [];
    if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
    if (severity) { sql += ` AND severity = $${params.length + 1}`; params.push(severity); }
    if (agent_id) { sql += ` AND agent_id = $${params.length + 1}`; params.push(agent_id); }
    sql += " ORDER BY created_at DESC LIMIT 100";
    const result = await query(sql, params, req.providerContext);
    res.json(result.rows);
  } catch (err) { next(err); }
};

export const getAlertById = async (req, res, next) => {
  try {
    const result = await query("SELECT * FROM anomaly_alerts WHERE id = $1", [req.params.id], req.providerContext);
    if (!result.rows[0]) return res.status(404).json({ error: "Alert not found" });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};

export const acknowledgeAlert = async (req, res, next) => {
  try {
    await query("UPDATE anomaly_alerts SET status = 'acknowledged' WHERE id = $1", [req.params.id], req.providerContext);
    res.json({ id: req.params.id, status: "acknowledged" });
  } catch (err) { next(err); }
};

export const manualEscalate = async (req, res, next) => {
  try {
    const { escalateCase } = await import("./sla/sla-escalation.service.js");
    const result = await escalateCase(req.params.id, "manual");
    res.json(result);
  } catch (err) { next(err); }
};