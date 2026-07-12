CREATE TABLE sla_matrix (
  severity            severity_level PRIMARY KEY,
  response_minutes    int NOT NULL,
  escalation_minutes  int NOT NULL,
  auto_create_case    boolean NOT NULL DEFAULT false
);

-- Default policy: low-severity alerts stay alert-only (agent/dashboard
-- visibility). medium and above escalate into a case for Ops Portal triage.
INSERT INTO sla_matrix (severity, response_minutes, escalation_minutes, auto_create_case) VALUES
  ('low',      240, 480, false),
  ('medium',   60,  120, true),
  ('high',     15,  30,  true),
  ('critical', 5,   15,  true);

CREATE TABLE alerts (
  alert_id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id   uuid NOT NULL REFERENCES providers(provider_id),
  anomaly_id    uuid REFERENCES anomalies(anomaly_id),
  case_id       uuid,                          -- set by trigger below, nullable
  severity      severity_level NOT NULL,
  status        text NOT NULL DEFAULT 'open',   -- open | acknowledged | resolved | expired
  sla_deadline  timestamptz NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE cases (
  case_id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id      uuid NOT NULL REFERENCES providers(provider_id),
  alert_id         uuid NOT NULL REFERENCES alerts(alert_id),
  assigned_to      uuid REFERENCES users(user_id),
  priority         severity_level NOT NULL,
  status           text NOT NULL DEFAULT 'unassigned', -- unassigned | in_progress | resolved | breached
  sla_breached_at  timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  resolved_at      timestamptz
);

ALTER TABLE alerts ADD CONSTRAINT fk_alerts_case FOREIGN KEY (case_id) REFERENCES cases(case_id);

CREATE INDEX idx_alerts_provider ON alerts(provider_id, status);
CREATE INDEX idx_cases_provider ON cases(provider_id, status);
CREATE INDEX idx_cases_assigned_to ON cases(assigned_to);

-- Auto-create a case only when sla_matrix.auto_create_case says so for that
-- alert's severity. Runs AFTER INSERT (not BEFORE) because cases.alert_id
-- has a FK into alerts -- the alert row must already exist and be committed
-- within the transaction before a case can reference it.
CREATE OR REPLACE FUNCTION fn_auto_create_case() RETURNS trigger AS $$
DECLARE
  should_create boolean;
  new_case_id   uuid;
BEGIN
  SELECT auto_create_case INTO should_create FROM sla_matrix WHERE severity = NEW.severity;

  IF should_create THEN
    INSERT INTO cases (provider_id, alert_id, priority)
    VALUES (NEW.provider_id, NEW.alert_id, NEW.severity)
    RETURNING case_id INTO new_case_id;

    UPDATE alerts SET case_id = new_case_id WHERE alert_id = NEW.alert_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_create_case
AFTER INSERT ON alerts
FOR EACH ROW EXECUTE FUNCTION fn_auto_create_case();
