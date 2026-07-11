import { query } from "../../database/database.module.js";

export const logAction = async (caseId, action, actorType, actorId, details, providerBoundary = null) => {
  let validActorId = null;
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(actorId)) {
    validActorId = actorId;
  }

  // Fallback to null for entity_id if caseId is undefined/null (e.g. transaction created)
  let validEntityId = null;
  if (caseId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(caseId)) {
    validEntityId = caseId;
  }

  await query(
    `INSERT INTO audit_logs (log_id, provider_id, actor_id, action, entity_type, entity_id, payload, created_at) 
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW())`,
    [providerBoundary, validActorId, action, caseId ? 'case' : 'transaction', validEntityId, JSON.stringify(details)]
  );
};

export const getAuditTrail = async (caseId) => {
  const result = await query("SELECT * FROM audit_logs WHERE entity_id = $1 ORDER BY created_at ASC", [caseId]);
  return result.rows;
};