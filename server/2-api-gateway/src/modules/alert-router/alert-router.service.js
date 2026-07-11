import { query } from "../../database/database.module.js";
import redis from "../../redis/redis.module.js";
import { generateAlertExplanation } from "./openai.service.js";
import crypto from "crypto";

const SLA_MATRIX = {
  liquidity_critical: { minutes: 30, firstResponder: "agent", escalation: ["field_officer", "area_manager", "ops_team"] },
  liquidity_high: { minutes: 60, firstResponder: "agent", escalation: ["field_officer", "ops_team"] },
  anomaly_high: { minutes: 120, firstResponder: "ops_team", escalation: ["risk_analyst"] },
  anomaly_medium: { minutes: 240, firstResponder: "ops_team", escalation: ["area_manager"] },
  data_quality: { minutes: 60, firstResponder: "ops_team", escalation: ["ops_team"] },
};

const uuid = () => crypto.randomUUID();

export const createAlert = async (analysis, agentId, user) => {
  const alerts = analysis.alerts || [];
  const createdAlerts = [];

  for (const alert of alerts) {
    const severityStr = (alert.risk_level || 'medium').toLowerCase();
    const severity = ['low', 'medium', 'high', 'critical'].includes(severityStr) ? severityStr : 'medium';
    
    const alertType = alert.alert_type || "anomaly_medium";
    const sla = SLA_MATRIX[alertType] || SLA_MATRIX.anomaly_medium;

    const alertId = uuid();
    const slaDeadline = new Date(Date.now() + sla.minutes * 60000);
    const providerId = user.provider_id; 

    await query(
      `INSERT INTO alerts (alert_id, provider_id, severity, status, sla_deadline, created_at)
       VALUES ($1, $2, $3, 'open', $4, NOW())`,
      [alertId, providerId, severity, slaDeadline]
    );

    const alertRes = await query(`SELECT case_id FROM alerts WHERE alert_id = $1`, [alertId]);
    const caseId = alertRes.rows[0]?.case_id;

    if (caseId && redis.status === 'ready') {
      await redis.setex(`sla:case:${caseId}`, sla.minutes * 60, JSON.stringify({ caseId, alertId, agentId, level: 0, escalationPath: sla.escalation }));
    }
    
    createdAlerts.push({ alertId, caseId, severity, slaDeadline, type: alertType.includes("liquidity") ? "liquidity" : "anomaly" });
  }

  return createdAlerts;
};