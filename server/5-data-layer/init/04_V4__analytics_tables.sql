CREATE TYPE severity_level AS ENUM ('low', 'medium', 'high', 'critical');

-- transaction_id/transaction_time are a soft reference into the transactions
-- hypertable (see V3 note) -- validated by the Analytics Engine, not the DB.
CREATE TABLE anomalies (
  anomaly_id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id       uuid NOT NULL REFERENCES providers(provider_id),
  transaction_id    uuid NOT NULL,
  transaction_time  timestamptz NOT NULL,
  z_score           double precision,
  cv_score          double precision,
  severity          severity_level NOT NULL,
  detected_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE forecasts (
  forecast_id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id          uuid NOT NULL REFERENCES providers(provider_id),
  account_id           uuid NOT NULL REFERENCES accounts(account_id),
  projected_liquidity  numeric(18,2),
  burn_rate            numeric(18,2),
  horizon_days         int NOT NULL DEFAULT 7,
  generated_at         timestamptz NOT NULL DEFAULT now()
);

-- Evidence attaches to exactly one of anomaly_id / forecast_id, never both,
-- never neither -- enforced by the check constraint below.
CREATE TABLE evidence (
  evidence_id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id       uuid NOT NULL REFERENCES providers(provider_id),
  anomaly_id        uuid REFERENCES anomalies(anomaly_id),
  forecast_id       uuid REFERENCES forecasts(forecast_id),
  shap_values       jsonb NOT NULL,
  confidence_score  double precision NOT NULL CHECK (confidence_score BETWEEN 0 AND 1),
  generated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT evidence_exactly_one_source CHECK (
    (anomaly_id IS NOT NULL)::int + (forecast_id IS NOT NULL)::int = 1
  )
);

CREATE INDEX idx_anomalies_provider ON anomalies(provider_id, detected_at DESC);
CREATE INDEX idx_anomalies_transaction ON anomalies(transaction_id, transaction_time);
CREATE INDEX idx_forecasts_provider ON forecasts(provider_id, generated_at DESC);
