import { query } from "../../database/database.module.js";

export const logAction = async (caseId, action, actorType, actorId, details, providerBoundary = null) => {
  await query(
    `INSERT INTO audit_logs (id, case_id, action, actor_type, actor_id, details, provider_boundary, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW())`,
    [caseId, action, actorType, actorId, JSON.stringify(details), providerBoundary]
  );
};

export const getAuditTrail = async (caseId) => {
  const result = await query("SELECT * FROM audit_logs WHERE case_id = $1 ORDER BY created_at ASC", [caseId]);
  return result.rows;
};