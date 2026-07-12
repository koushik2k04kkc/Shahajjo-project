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

export const createAlert = async (analysis, accountId, agentId, user) => {
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
      `INSERT INTO alerts (alert_id, provider_id, account_id, severity, status, sla_deadline, evidence_details, created_at)
       VALUES ($1, $2, $3, $4, 'open', $5, $6, NOW())`,
      [alertId, providerId, accountId, severity, slaDeadline, JSON.stringify(alert)]
    );

    const alertRes = await query(`SELECT case_id FROM alerts WHERE alert_id = $1`, [alertId]);
    const caseId = alertRes.rows[0]?.case_id;

    if (caseId && redis.status === 'ready') {
      await redis.setex(`sla:case:${caseId}`, sla.minutes * 60, JSON.stringify({ caseId, alertId, accountId, level: 0, escalationPath: sla.escalation }));
    }
    
    let evidenceText = "";
    if (alert.evidence_details) {
      if (typeof alert.evidence_details === "string") {
        evidenceText = alert.evidence_details;
      } else if (typeof alert.evidence_details === "object") {
        evidenceText = Object.entries(alert.evidence_details)
          .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
          .join("\n");
      }
    }

    let confidenceScore = 50;
    if (typeof alert.confidence_level === "string") {
      const lower = alert.confidence_level.toLowerCase();
      if (lower.includes("high")) confidenceScore = 95;
      else if (lower.includes("medium")) confidenceScore = 70;
      else if (lower.includes("low")) confidenceScore = 30;
    } else if (typeof alert.confidence_level === "number") {
      confidenceScore = Math.round(alert.confidence_level * 100);
    }

    const formattedTitle = (alert.alert_type || "Anomaly Alert")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    createdAlerts.push({
      id: alertId,
      alertId,
      caseId,
      severity,
      slaDeadline,
      type: alertType.includes("liquidity") ? "liquidity" : "anomaly",
      account_id: accountId,
      agent_id: agentId,
      provider_id: providerId,
      provider: providerId,
      evidence_details: alert.evidence_details,
      message_en: alert.message_en,
      message_bn: alert.message_bn,
      confidence_level: alert.confidence_level,
      
      // Flattened properties for the UI
      title: formattedTitle,
      titleBn: "সতর্কতা: " + formattedTitle,
      situation: alert.message_en || "Unusual transaction pattern detected.",
      situationBn: alert.message_bn || "অস্বাভাবিক লেনদেনের ধরন শনাক্ত হয়েছে।",
      evidence: evidenceText || "No additional evidence provided.",
      evidenceBn: evidenceText || "কোনো অতিরিক্ত প্রমাণ নেই।",
      action: alert.recommended_action || "Investigate the transaction history.",
      actionBn: alert.recommended_action || "লেনদেনের ইতিহাস তদন্ত করুন।",
      confidence: confidenceScore,
      status: "Detected",
      currentStep: 1,
      owner: "Unassigned",
      time: new Date().toLocaleTimeString(),
    });
  }

  return createdAlerts;
};