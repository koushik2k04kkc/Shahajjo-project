import { query } from "../../database/database.module.js";

export const getAgentBalances = async (req, res, next) => {
  try {
    const agentResult = await query("SELECT id, name, physical_cash_balance, physical_cash_reserved, status FROM agents WHERE id = $1", [req.params.agentId]);
    const balanceResult = await query(
      `SELECT apb.*, p.code, p.name FROM agent_provider_balances apb JOIN providers p ON apb.provider_id = p.id WHERE apb.agent_id = $1`,
      [req.params.agentId],
      req.providerContext
    );
    res.json({ agent: agentResult.rows[0], provider_balances: balanceResult.rows });
  } catch (err) { next(err); }
};

export const getAllAgentBalances = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT a.id, a.name, a.area, a.physical_cash_balance, a.status,
        json_agg(json_build_object('provider', p.code, 'balance', apb.e_money_balance, 'reserved', apb.e_money_reserved)) as providers
       FROM agents a
       LEFT JOIN agent_provider_balances apb ON a.id = apb.agent_id
       LEFT JOIN providers p ON apb.provider_id = p.id
       GROUP BY a.id LIMIT 200`,
      [],
      req.providerContext
    );
    res.json(result.rows);
  } catch (err) { next(err); }
};