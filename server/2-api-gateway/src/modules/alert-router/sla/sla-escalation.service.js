import { query } from "../../../database/database.module.js";
import redis from "../../../redis/redis.module.js";
import { SLA_MATRIX } from "./sla-matrix.js";

export const escalateCase = async (caseId, reason = "sla_breach") => {
  const caseResult = await query("SELECT * FROM cases WHERE id = $1", [caseId]);
  if (!caseResult.rows[0]) return null;
  const c = caseResult.rows[0];

  const timerData = await redis.get(`sla:case:${caseId}`);
  if (!timerData) return null;

  const { escalationPath, level } = JSON.parse(timerData);
  if (level >= escalationPath.length) return null;

  const nextRole = escalationPath[level];
  const newLevel = level + 1;

  await query(
    `UPDATE cases SET current_owner_role = $1, assigned_to_role = $1, escalation_level = $2, status = 'escalated', updated_at = NOW() WHERE id = $3`,
    [nextRole, newLevel, caseId]
  );

  await query(
    `INSERT INTO audit_logs (id, case_id, action, actor_type, actor_id, details, created_at) VALUES (gen_random_uuid(), $1, 'escalated', 'system', 'system', $2, NOW())`,
    [caseId, JSON.stringify({ reason, from: c.current_owner_role, to: nextRole, level: newLevel })]
  );

  const sla = SLA_MATRIX[c.case_type === "liquidity" ? "liquidity_critical" : "anomaly_high"];
  await redis.setex(`sla:case:${caseId}`, sla.minutes * 60, JSON.stringify({ caseId, alertId: c.alert_id, agentId: c.current_owner_id, level: newLevel, escalationPath }));

  return { caseId, escalatedTo: nextRole, newLevel, slaDeadline: new Date(Date.now() + sla.minutes * 60000) };
};