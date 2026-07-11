import { query } from "../../database/database.module.js";

export const create = async (data, providerId = null) => {
  const result = await query(
    `INSERT INTO transactions (id, agent_id, provider_id, transaction_type, amount, status, customer_ref_hash, created_at)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
    [data.agent_id, data.provider_id, data.transaction_type, data.amount, data.status, data.customer_ref_hash],
    providerId
  );
  return result.rows[0];
};

export const findByAgentId = async (agentId, hours = 4, providerId = null) => {
  const result = await query(
    `SELECT * FROM transactions WHERE agent_id = $1 AND created_at > NOW() - INTERVAL '${hours} hours' ORDER BY created_at DESC`,
    [agentId],
    providerId
  );
  return result.rows;
};