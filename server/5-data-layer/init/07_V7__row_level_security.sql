-- Every provider-scoped table gets the same isolation pattern. The NestJS
-- Auth & Provider Boundary Guard sets this once per request, right after
-- verifying the JWT and before any query runs:
--
--   SET LOCAL app.current_provider_id = '<provider_id claim from the JWT>';
--
-- SET LOCAL scopes the setting to the current transaction, so it can never
-- leak across pooled connections or concurrent requests.

CREATE OR REPLACE FUNCTION fn_current_provider_id() RETURNS uuid AS $$
  SELECT NULLIF(current_setting('app.current_provider_id', true), '')::uuid;
$$ LANGUAGE sql STABLE;

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'users', 'accounts', 'balances',
    'anomalies', 'forecasts', 'evidence', 'alerts', 'cases'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);  -- applies even to the table owner
    EXECUTE format(
      'CREATE POLICY provider_isolation ON %I USING (provider_id = fn_current_provider_id())',
      t
    );
  END LOOP;
END
$$;

-- app_role is the only role the running services (API Gateway, Analytics
-- Engine) connect as. No BYPASSRLS, no direct table ownership.
GRANT SELECT, INSERT, UPDATE ON
  users, accounts, balances, transactions, anomalies, forecasts, evidence, alerts, cases
TO app_role;

-- providers itself isn't provider-scoped (it IS the list of providers), so
-- it's excluded from the loop above and just gets plain read access.
GRANT SELECT ON providers TO app_role;

-- Open question for you: 'admin' role users currently get the SAME isolation
-- as everyone else (FORCE ROW LEVEL SECURITY applies to all roles except the
-- table owner). If platform admins need cross-provider visibility for
-- support/ops purposes, that needs a deliberate, audited exception -- e.g. a
-- separate admin_role with its own narrower RLS policy -- not a blanket
-- BYPASSRLS grant. Flagging this rather than silently deciding it for you.
