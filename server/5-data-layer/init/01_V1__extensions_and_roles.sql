-- Enable UUID generation and TimescaleDB
CREATE EXTENSION IF NOT EXISTS pgcrypto;      -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Application role used by the NestJS API Gateway and FastAPI Analytics Engine.
-- Never grant BYPASSRLS to this role -- that would defeat the provider isolation
-- policies added in V7.
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_role') THEN
    CREATE ROLE app_role LOGIN PASSWORD 'change_me_in_env' NOBYPASSRLS;
  END IF;
END
$$;

-- Migration/owner role, used only by the CI migration runner -- never by the
-- running services.
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'migrator_role') THEN
    CREATE ROLE migrator_role LOGIN PASSWORD 'change_me_in_env' SUPERUSER;
  END IF;
END
$$;
