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
  const anomalies = analysis.anomalies || [];
  const projections = analysis.projections || [];
  const createdAlerts = [];

  for (const anomaly of anomalies) {
    if (anomaly.confidence < 0.5) continue;
    const severity = anomaly.confidence > 0.85 ? "high" : anomaly.confidence > 0.7 ? "medium" : "low";
    const alertType = `${anomaly.type}_${severity}`;
    const sla = SLA_MATRIX[alertType] || SLA_MATRIX.anomaly_medium;

    const [titleBn, titleEn, titleBanglish] = await Promise.all([
      generateAlertExplanation(anomaly, "bn"),
      generateAlertExplanation(anomaly, "en"),
      generateAlertExplanation(anomaly, "banglish"),
    ]);

    const alertId = uuid();
    const caseId = uuid();
    const slaDeadline = new Date(Date.now() + sla.minutes * 60000);

    await query(
      `INSERT INTO anomaly_alerts (id, agent_id, provider_id, alert_type, severity, title_bn, title_en, title_banglish, description_en, evidence, confidence_score, false_positive_risk, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())`,
      [alertId, agentId, anomaly.provider_id || user.provider_id, anomaly.type, severity, titleBn, titleEn, titleBanglish, titleEn, JSON.stringify(anomaly.evidence), anomaly.confidence, "medium", "open"],
      user.provider_id
    );

    await query(
      `INSERT INTO cases (id, alert_id, case_type, priority, current_owner_role, current_owner_id, assigned_to_role, assigned_to_id, escalation_level, status, recommended_action, sla_deadline, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())`,
      [caseId, alertId, "anomaly", severity === "high" ? 1 : severity === "medium" ? 2 : 3, sla.firstResponder, agentId, sla.firstResponder, agentId, 0, "new", titleEn, slaDeadline],
      user.provider_id
    );

    await redis.setex(`sla:case:${caseId}`, sla.minutes * 60, JSON.stringify({ caseId, alertId, agentId, level: 0, escalationPath: sla.escalation }));
    createdAlerts.push({ alertId, caseId, severity, slaDeadline });
  }

  for (const proj of projections) {
    if (proj.confidence < 0.6) continue;
    const severity = proj.confidence > 0.8 ? "critical" : "high";
    const alertType = `liquidity_${severity}`;
    const sla = SLA_MATRIX[alertType] || SLA_MATRIX.liquidity_high;

    const [titleBn, titleEn, titleBanglish] = await Promise.all([
      generateAlertExplanation({ ...proj, alert_type: "liquidity_shortage", confidence_score: proj.confidence }, "bn"),
      generateAlertExplanation({ ...proj, alert_type: "liquidity_shortage", confidence_score: proj.confidence }, "en"),
      generateAlertExplanation({ ...proj, alert_type: "liquidity_shortage", confidence_score: proj.confidence }, "banglish"),
    ]);

    const alertId = uuid();
    const caseId = uuid();
    const slaDeadline = new Date(Date.now() + sla.minutes * 60000);

    await query(
      `INSERT INTO anomaly_alerts (id, agent_id, provider_id, alert_type, severity, title_bn, title_en, title_banglish, description_en, evidence, confidence_score, false_positive_risk, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())`,
      [alertId, agentId, proj.provider_id, "liquidity_pressure", severity, titleBn, titleEn, titleBanglish, titleEn, JSON.stringify(proj), proj.confidence, "low", "open"],
      user.provider_id
    );

    await query(
      `INSERT INTO cases (id, alert_id, case_type, priority, current_owner_role, current_owner_id, assigned_to_role, assigned_to_id, escalation_level, status, recommended_action, sla_deadline, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())`,
      [caseId, alertId, "liquidity", 1, sla.firstResponder, agentId, sla.firstResponder, agentId, 0, "new", proj.recommended_action, slaDeadline],
      user.provider_id
    );

    await redis.setex(`sla:case:${caseId}`, sla.minutes * 60, JSON.stringify({ caseId, alertId, agentId, level: 0, escalationPath: sla.escalation }));
    createdAlerts.push({ alertId, caseId, severity, slaDeadline, type: "liquidity" });
  }

  return createdAlerts;
};