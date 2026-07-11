import { query } from "../../database/database.module.js";
import { logAction } from "../audit-log/audit-log.service.js";
import { cancelSlaTimer } from "../../redis/queue/sla-timer.processor.js";

export const getCases = async (req, res, next) => {
  try {
    const { status, role } = req.query;
    let sql = "SELECT * FROM cases WHERE 1=1";
    const params = [];
    if (status) { sql += ` AND status = $${params.length + 1}`; params.push(status); }
    if (role) { sql += ` AND assigned_to_role = $${params.length + 1}`; params.push(role); }
    sql += " ORDER BY created_at DESC LIMIT 100";
    const result = await query(sql, params, req.providerContext);
    res.json(result.rows);
  } catch (err) { next(err); }
};

export const getCaseById = async (req, res, next) => {
  try {
    const result = await query("SELECT * FROM cases WHERE id = $1", [req.params.caseId], req.providerContext);
    if (!result.rows[0]) return res.status(404).json({ error: "Case not found" });
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};

export const acknowledgeCase = async (req, res, next) => {
  try {
    const result = await query("UPDATE cases SET status = 'acknowledged', updated_at = NOW() WHERE id = $1 RETURNING *", [req.params.caseId], req.providerContext);
    if (result.rows.length === 0) return res.status(404).json({ error: "Case not found" });
    await logAction(req.params.caseId, "acknowledged", req.user.role, req.user.id, {}, req.providerContext);
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};

export const assignCase = async (req, res, next) => {
  try {
    const { assigned_to_role, assigned_to_id } = req.body;
    const result = await query(
      "UPDATE cases SET assigned_to_role = $1, assigned_to_id = $2, current_owner_role = $1, current_owner_id = $2, updated_at = NOW() WHERE id = $3 RETURNING *",
      [assigned_to_role, assigned_to_id, req.params.caseId],
      req.providerContext
    );
    await logAction(req.params.caseId, "assigned", req.user.role, req.user.id, { assigned_to_role, assigned_to_id }, req.providerContext);
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};

export const resolveCase = async (req, res, next) => {
  try {
    const { resolution_notes, false_positive } = req.body;
    const result = await query(
      "UPDATE cases SET status = 'resolved', resolution_notes = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [resolution_notes, req.params.caseId],
      req.providerContext
    );
    await cancelSlaTimer(req.params.caseId);
    await logAction(req.params.caseId, "resolved", req.user.role, req.user.id, { resolution_notes, false_positive: false_positive || false }, req.providerContext);
    res.json(result.rows[0]);
  } catch (err) { next(err); }
};