import { query } from "../../database/database.module.js";
import { logAction } from "../audit-log/audit-log.service.js";
import { cancelSlaTimer } from "../../redis/queue/sla-timer.processor.js";

const mapCaseRowToFrontend = (row) => {
  if (!row) return row;
  const details = row.evidence_details || {};
  const formattedTitle = (details.alert_type || "Anomaly Alert")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  // Default SLA is 60 mins from creation unless breached or defined
  const createdTime = new Date(row.created_at).getTime();
  const slaTime = row.sla_breached_at || new Date(createdTime + 60 * 60 * 1000).toISOString();

  // Status mapping
  let currentStep = 1; // Detected
  if (row.status === 'resolved') currentStep = 5;
  else if (row.status === 'in_progress') currentStep = 3;
  else if (row.status === 'acknowledged') currentStep = 3;

  return {
    id: row.case_id,
    caseId: row.case_id,
    alertId: row.alert_id,
    priority: row.priority || "medium",
    status: row.status || "unassigned",
    title: formattedTitle,
    titleBn: "কেস: " + formattedTitle,
    owner: "Unassigned",
    ownerBn: "অননুমোদিত",
    sla: slaTime,
    steps: ['Detected', 'Assigned', 'Acknowledged', 'Human review', 'Resolved'].map((label) => ({ label })),
    currentStep: currentStep,
    created_at: row.created_at,
    resolved_at: row.resolved_at,
    provider: row.provider_code || "bkash"
  };
};

const getCaseWithDetails = async (caseId, providerContext) => {
  const result = await query(
    `SELECT c.*, a.evidence_details, p.code AS provider_code
     FROM cases c
     LEFT JOIN alerts a ON c.alert_id = a.alert_id
     LEFT JOIN providers p ON c.provider_id = p.provider_id
     WHERE c.case_id = $1`,
    [caseId],
    providerContext
  );
  return mapCaseRowToFrontend(result.rows[0]);
};

export const getCases = async (req, res, next) => {
  try {
    const { status, role } = req.query;
    let sql = `
      SELECT c.*, a.evidence_details, p.code AS provider_code
      FROM cases c
      LEFT JOIN alerts a ON c.alert_id = a.alert_id
      LEFT JOIN providers p ON c.provider_id = p.provider_id
      WHERE 1=1
    `;
    const params = [];
    if (status) { sql += ` AND c.status = $${params.length + 1}`; params.push(status); }
    sql += " ORDER BY c.created_at DESC LIMIT 100";
    const result = await query(sql, params, req.providerContext);
    res.json(result.rows.map(mapCaseRowToFrontend));
  } catch (err) { next(err); }
};

export const getCaseById = async (req, res, next) => {
  try {
    const caseData = await getCaseWithDetails(req.params.caseId, req.providerContext);
    if (!caseData) return res.status(404).json({ error: "Case not found" });
    res.json(caseData);
  } catch (err) { next(err); }
};

export const acknowledgeCase = async (req, res, next) => {
  try {
    const result = await query(
      "UPDATE cases SET status = 'acknowledged' WHERE case_id = $1 RETURNING *",
      [req.params.caseId],
      req.providerContext
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Case not found" });
    await logAction(req.params.caseId, "acknowledged", req.user.role, req.user.id, {}, req.providerContext);
    const updated = await getCaseWithDetails(req.params.caseId, req.providerContext);
    res.json(updated);
  } catch (err) { next(err); }
};

export const assignCase = async (req, res, next) => {
  try {
    const { assigned_to_id } = req.body;
    const result = await query(
      "UPDATE cases SET assigned_to = $1, status = 'in_progress' WHERE case_id = $2 RETURNING *",
      [assigned_to_id || req.user.id, req.params.caseId],
      req.providerContext
    );
    await logAction(req.params.caseId, "assigned", req.user.role, req.user.id, { assigned_to_id }, req.providerContext);
    const updated = await getCaseWithDetails(req.params.caseId, req.providerContext);
    res.json(updated);
  } catch (err) { next(err); }
};

export const resolveCase = async (req, res, next) => {
  try {
    const { resolution_notes, false_positive } = req.body;
    const result = await query(
      "UPDATE cases SET status = 'resolved', resolved_at = NOW() WHERE case_id = $1 RETURNING *",
      [req.params.caseId],
      req.providerContext
    );
    await cancelSlaTimer(req.params.caseId);
    await logAction(req.params.caseId, "resolved", req.user.role, req.user.id, { resolution_notes, false_positive: false_positive || false }, req.providerContext);
    const updated = await getCaseWithDetails(req.params.caseId, req.providerContext);
    res.json(updated);
  } catch (err) { next(err); }
};