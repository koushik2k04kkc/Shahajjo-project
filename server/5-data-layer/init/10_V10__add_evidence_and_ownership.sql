-- 1. Add nullable user_id to accounts to establish the human ownership path
ALTER TABLE accounts
  ADD COLUMN user_id uuid REFERENCES users(user_id);

-- 2. Add nullable account_id and evidence details to alerts
-- account_id is nullable because some alerts (e.g., liquidity) might apply 
-- to the whole provider rather than a specific account.
ALTER TABLE alerts 
  ADD COLUMN account_id uuid REFERENCES accounts(account_id),
  ADD COLUMN evidence_details jsonb;

-- Index for the new ownership links
CREATE INDEX idx_accounts_user ON accounts(user_id);
CREATE INDEX idx_alerts_account ON alerts(account_id);

-- 3. Update existing seed data to establish the ownership link
UPDATE accounts a
SET user_id = u.user_id
FROM users u 
WHERE 
  (a.account_number IN ('ACC-001', 'ACC-002', 'ACC-003') AND u.email = 'agent1@bkash.test') OR
  (a.account_number IN ('ACC-101', 'ACC-102', 'ACC-103') AND u.email = 'agent1@nagad.test');

