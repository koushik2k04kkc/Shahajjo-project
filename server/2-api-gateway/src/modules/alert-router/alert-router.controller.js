import { query } from "../../database/database.module.js";

const mapAlertRowToFrontend = (row) => {
  if (!row) return row;
  const details = row.evidence_details || {};
  
  // Format evidence into a string if it's an object
  let evidenceText = "";
  if (details.evidence_details) {
    if (typeof details.evidence_details === "string") {
      evidenceText = details.evidence_details;
    } else if (typeof details.evidence_details === "object") {
      evidenceText = Object.entries(details.evidence_details)
        .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
        .join("\n");
    }
  }

  let confidenceScore = 50;
  if (typeof details.confidence_level === "string") {
    const lower = details.confidence_level.toLowerCase();
    if (lower.includes("high")) confidenceScore = 95;
    else if (lower.includes("medium")) confidenceScore = 70;
    else if (lower.includes("low")) confidenceScore = 30;
  } else if (typeof details.confidence_level === "number") {
    confidenceScore = Math.round(details.confidence_level * 100);
  }

  const formattedTitle = (details.alert_type || "Anomaly Alert")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    id: row.alert_id,
    alertId: row.alert_id,
    caseId: row.case_id,
    severity: row.severity,
    status: row.status,
    slaDeadline: row.sla_deadline,
    createdAt: row.created_at,
    provider: details.provider || "bkash",
    account_id: row.account_id,
    
    // Flattened properties for the UI
    title: formattedTitle,
    titleBn: "সতর্কতা: " + formattedTitle,
    situation: details.message_en || "Unusual transaction pattern detected.",
    situationBn: details.message_bn || "অস্বাভাবিক লেনদেনের ধরন শনাক্ত হয়েছে।",
    evidence: evidenceText || "No additional evidence provided.",
    evidenceBn: evidenceText || "কোনো অতিরিক্ত প্রমাণ নেই।",
    action: details.recommended_action || "Investigate the transaction history.",
    actionBn: details.recommended_action || "লেনদেনের ইতিহাস তদন্ত করুন।",
    confidence: confidenceScore,
    currentStep: row.status === 'resolved' ? 5 : (row.status === 'acknowledged' ? 3 : 1),
    owner: "Unassigned",
    time: row.created_at
  };
};

export const getAlerts = async (req, res, next) => {
  try {
    const { status, severity, agent_id } = req.query;
    let sql = "SELECT * FROM alerts WHERE 1=1";
    const params = [];
    if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
    if (severity) { sql += ` AND severity = $${params.length + 1}`; params.push(severity); }
    if (agent_id) { sql += ` AND account_id = $${params.length + 1}`; params.push(agent_id); }
    sql += " ORDER BY created_at DESC LIMIT 100";
    const result = await query(sql, params, req.providerContext);
    res.json(result.rows.map(mapAlertRowToFrontend));
  } catch (err) { next(err); }
};

export const getAlertById = async (req, res, next) => {
  try {
    const result = await query("SELECT * FROM alerts WHERE alert_id = $1", [req.params.id], req.providerContext);
    if (!result.rows[0]) return res.status(404).json({ error: "Alert not found" });
    res.json(mapAlertRowToFrontend(result.rows[0]));
  } catch (err) { next(err); }
};

export const acknowledgeAlert = async (req, res, next) => {
  try {
    await query("UPDATE alerts SET status = 'acknowledged' WHERE alert_id = $1", [req.params.id], req.providerContext);
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