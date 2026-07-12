import { query } from "../../database/database.module.js";

export const getByAgentId = async (agentId, providerId = null) => {
  const result = await query(
    `SELECT apb.*, p.code, p.name FROM agent_provider_balances apb JOIN providers p ON apb.provider_id = p.id WHERE apb.agent_id = $1`,
    [agentId],
    providerId
  );
  return result.rows;
};