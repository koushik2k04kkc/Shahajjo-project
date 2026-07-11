-- ============================================================
-- V8 seed data -- LOCAL / DEV ONLY. Never run against staging or
-- production. Runs as the docker-entrypoint-initdb.d superuser, so it
-- bypasses RLS automatically (superuser is always exempt) -- no need to
-- SET app.current_provider_id here.
--
-- Creates:
--   2 providers (bKash, Nagad) with fixed UUIDs, for easy manual RLS testing
--   3 users per provider (agent, ops_analyst, risk_analyst)
--   3 accounts per provider
--   1 balance per account
--   4 transactions per account (one deliberately oversized)
--   1 anomaly + 1 high-severity alert -- exercises the V5 auto-case trigger
-- ============================================================

WITH new_providers AS (
  INSERT INTO providers (provider_id, name, code)
  VALUES
    ('11111111-1111-1111-1111-111111111111', 'bKash', 'bkash'),
    ('22222222-2222-2222-2222-222222222222', 'Nagad', 'nagad')
  RETURNING provider_id, code
),

new_users AS (
  INSERT INTO users (provider_id, email, password_hash, role)
  SELECT p.provider_id, u.email, u.password_hash, u.role::user_role
  FROM (VALUES
    ('bkash', 'agent1@bkash.test', 'dev_only_not_a_real_hash', 'agent'),
    ('bkash', 'ops1@bkash.test',   'dev_only_not_a_real_hash', 'ops_analyst'),
    ('bkash', 'risk1@bkash.test',  'dev_only_not_a_real_hash', 'risk_analyst'),
    ('nagad', 'agent1@nagad.test', 'dev_only_not_a_real_hash', 'agent'),
    ('nagad', 'ops1@nagad.test',   'dev_only_not_a_real_hash', 'ops_analyst'),
    ('nagad', 'risk1@nagad.test',  'dev_only_not_a_real_hash', 'risk_analyst')
  ) AS u(provider_code, email, password_hash, role)
  JOIN new_providers p ON p.code = u.provider_code
  RETURNING user_id, provider_id
),

new_accounts AS (
  INSERT INTO accounts (provider_id, account_number, owner_name, kyc_status)
  SELECT p.provider_id, a.account_number, a.owner_name, 'verified'
  FROM (VALUES
    ('bkash', 'ACC-001', 'Rahim Uddin'),
    ('bkash', 'ACC-002', 'Karim Ahmed'),
    ('bkash', 'ACC-003', 'Fatema Begum'),
    ('nagad', 'ACC-101', 'Sultana Akter'),
    ('nagad', 'ACC-102', 'Jahangir Alam'),
    ('nagad', 'ACC-103', 'Nasrin Chowdhury')
  ) AS a(provider_code, account_number, owner_name)
  JOIN new_providers p ON p.code = a.provider_code
  RETURNING account_id, provider_id, account_number
),

new_balances AS (
  INSERT INTO balances (provider_id, account_id, currency, amount)
  SELECT provider_id, account_id, 'BDT',
    CASE account_number
      WHEN 'ACC-001' THEN 15420.50
      WHEN 'ACC-002' THEN 8200.00
      WHEN 'ACC-003' THEN 132500.75
      WHEN 'ACC-101' THEN 22100.00
      WHEN 'ACC-102' THEN 5400.25
      WHEN 'ACC-103' THEN 98750.00
    END
  FROM new_accounts
  RETURNING balance_id, account_id
),

new_transactions AS (
  INSERT INTO transactions (provider_id, time, account_id, amount, type, metadata)
  SELECT provider_id, now() - (t.hours_ago || ' hours')::interval, account_id, t.amount, t.ttype, '{}'::jsonb
  FROM new_accounts
  CROSS JOIN (VALUES
    (1,  1200.00,  'cash_in'),
    (5,  850.00,   'p2p'),
    (12, 45000.00, 'cash_out'),   -- deliberately oversized -- this is the one flagged below
    (20, 300.00,   'merchant_pay')
  ) AS t(hours_ago, amount, ttype)
  RETURNING transaction_id, time, provider_id, amount, type
),

flagged_txn AS (
  -- Only one of the several 45,000 BDT cash_out rows gets flagged, just to
  -- demonstrate the anomaly -> alert -> auto-case flow with one example.
  SELECT transaction_id, time, provider_id
  FROM new_transactions
  WHERE amount = 45000.00 AND type = 'cash_out'
  LIMIT 1
),

new_anomaly AS (
  INSERT INTO anomalies (provider_id, transaction_id, transaction_time, z_score, cv_score, severity)
  SELECT provider_id, transaction_id, time, 4.2::double precision, 0.87::double precision, 'high'::severity_level
  FROM flagged_txn
  RETURNING anomaly_id, provider_id
)

INSERT INTO alerts (provider_id, anomaly_id, severity, sla_deadline)
SELECT provider_id, anomaly_id, 'high'::severity_level, now() + interval '30 minutes'
FROM new_anomaly;

-- Sanity check when run interactively -- comment out for unattended init:
-- SELECT a.alert_id, a.severity, a.case_id, c.status
-- FROM alerts a LEFT JOIN cases c ON c.case_id = a.case_id;
-- ^ case_id should be non-null here: the V5 trigger auto-created a case
--   because severity = 'high' has auto_create_case = true in sla_matrix.
