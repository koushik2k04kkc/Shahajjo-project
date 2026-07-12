CREATE TABLE balances (
  balance_id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id  uuid NOT NULL REFERENCES providers(provider_id),
  account_id   uuid NOT NULL REFERENCES accounts(account_id),
  currency     text NOT NULL DEFAULT 'BDT',
  amount       numeric(18,2) NOT NULL DEFAULT 0,
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (account_id, currency)
);

CREATE INDEX idx_balances_provider ON balances(provider_id);

-- transactions is a TimescaleDB hypertable, so the primary key must include
-- the partitioning column ("time"). Note: TimescaleDB does not support
-- foreign keys that REFERENCE a hypertable (confirmed against current docs),
-- so downstream tables (anomalies, forecasts) store transaction_id/time as a
-- soft reference only, enforced at the application layer, not by the DB.
CREATE TABLE transactions (
  transaction_id  uuid NOT NULL DEFAULT gen_random_uuid(),
  time            timestamptz NOT NULL,
  provider_id     uuid NOT NULL REFERENCES providers(provider_id),
  account_id      uuid NOT NULL REFERENCES accounts(account_id),
  amount          numeric(18,2) NOT NULL,
  type            text NOT NULL,           -- cash_in | cash_out | p2p | merchant_pay ...
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,
  PRIMARY KEY (transaction_id, time)
);

SELECT create_hypertable('transactions', 'time', chunk_time_interval => INTERVAL '1 day');

CREATE INDEX idx_transactions_provider_time ON transactions(provider_id, time DESC);
CREATE INDEX idx_transactions_account_time ON transactions(account_id, time DESC);

-- Compress chunks older than 7 days, drop raw detail after 180 days.
-- Adjust these two intervals to match your actual retention requirements.
ALTER TABLE transactions SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'provider_id, account_id'
);
SELECT add_compression_policy('transactions', INTERVAL '7 days');
SELECT add_retention_policy('transactions', INTERVAL '180 days');
