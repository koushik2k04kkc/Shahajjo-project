import { query } from "../../database/database.module.js";

const providerColors = {
  bkash: "#C6006F",
  nagad: "#F58220",
  rocket: "#6F2C91",
};

const toNumber = (value) => Number(value || 0);

const buildOverview = (agent, providerBalances) => {
  const providers = providerBalances.map((balance) => ({
    id: balance.code,
    name: balance.name,
    amount: toNumber(balance.e_money_balance ?? balance.amount),
    color: providerColors[balance.code] || "#2563EB",
    trend: "+0.0%",
    updated: "now",
  }));
  const cash = toNumber(agent?.physical_cash_balance);
  const total = providers.reduce((sum, provider) => sum + toNumber(provider.amount), cash);

  return {
    agent: agent || { id: "AGT-2048", name: "Rahman Telecom", status: "active" },
    total,
    cash,
    cashIn: 0,
    cashOut: 0,
    providers,
  };
};

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

export const getAgentOverview = async (req, res, next) => {
  try {
    const agentResult = await query(
      "SELECT id, name, physical_cash_balance, physical_cash_reserved, status FROM agents WHERE id = $1",
      [req.params.agentId]
    );
    const balanceResult = await query(
      `SELECT apb.*, p.code, p.name
       FROM agent_provider_balances apb
       JOIN providers p ON apb.provider_id = p.id
       WHERE apb.agent_id = $1`,
      [req.params.agentId],
      req.providerContext
    );

    res.json(buildOverview(agentResult.rows[0], balanceResult.rows));
  } catch (err) {
    if (err.code !== "42P01" && err.code !== "42703") return next(err);

    try {
      const balanceResult = await query(
        `SELECT p.code, p.name, SUM(b.amount) AS amount
         FROM balances b
         JOIN providers p ON b.provider_id = p.provider_id
         GROUP BY p.code, p.name
         ORDER BY p.name`,
        [],
        req.providerContext
      );

      res.json(buildOverview({ id: req.params.agentId, name: "Rahman Telecom", status: "active" }, balanceResult.rows));
    } catch (fallbackErr) {
      next(fallbackErr);
    }
  }
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
