CREATE TABLE audit_logs (
  log_id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id  uuid REFERENCES providers(provider_id),
  actor_id     uuid REFERENCES users(user_id),
  action       text NOT NULL,          -- 'case.assign', 'alert.acknowledge', 'balance.update' ...
  entity_type  text NOT NULL,
  entity_id    uuid,
  payload      jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_provider_time ON audit_logs(provider_id, created_at DESC);

-- Immutability, layer 1: app_role can INSERT and SELECT only. No grant for
-- UPDATE or DELETE exists at all, so even a bug in application code can't
-- issue them.
REVOKE UPDATE, DELETE ON audit_logs FROM app_role;
GRANT SELECT, INSERT ON audit_logs TO app_role;

-- Immutability, layer 2: belt-and-suspenders trigger that hard-blocks
-- UPDATE/DELETE regardless of which role attempts it (including migrator_role
-- or a future role that accidentally gets broader grants).
CREATE OR REPLACE FUNCTION fn_block_audit_log_mutation() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'audit_logs is append-only: % is not permitted', TG_OP;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_block_audit_update
BEFORE UPDATE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION fn_block_audit_log_mutation();

CREATE TRIGGER trg_block_audit_delete
BEFORE DELETE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION fn_block_audit_log_mutation();
