export const AuditLogEntity = {
  tableName: "audit_logs",
  columns: ["id", "case_id", "action", "actor_type", "actor_id", "details", "provider_boundary", "created_at"],
};