CREATE TABLE providers (
  provider_id  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  code         text NOT NULL UNIQUE,        -- e.g. 'bkash', 'nagad', 'rocket'
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TYPE user_role AS ENUM ('agent', 'ops_analyst', 'risk_analyst', 'admin');

CREATE TABLE users (
  user_id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id   uuid NOT NULL REFERENCES providers(provider_id),
  email         text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role          user_role NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE accounts (
  account_id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id     uuid NOT NULL REFERENCES providers(provider_id),
  account_number  text NOT NULL,
  owner_name      text NOT NULL,
  kyc_status      text NOT NULL DEFAULT 'pending',
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider_id, account_number)
);

CREATE INDEX idx_users_provider ON users(provider_id);
CREATE INDEX idx_accounts_provider ON accounts(provider_id);
