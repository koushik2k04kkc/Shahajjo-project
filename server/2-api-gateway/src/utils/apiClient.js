import axios from "axios";
import { config } from "../config/configuration.js";

const apiClient = axios.create({
  baseURL: config.analyticsUrl,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

export const analyzeAgent = async (agentId, transactions, balances) => {
  let agentState = {};
  try {
    agentState = {
      agent_id: agentId,
      area: "default_area",
      shared_physical_cash: 0,
      provider_balances: balances.map(b => ({
        provider: b.code || "bkash",
        balance: Number(b.amount || 0),
        last_updated: b.updated_at || new Date().toISOString()
      })),
      recent_transactions: transactions.map(t => ({
        transaction_id: t.transaction_id || "unknown",
        provider: t.provider_code || "bkash",
        agent_id: t.account_id || agentId,
        amount: Number(t.amount),
        type: t.type || "cash_out",
        timestamp: t.time || new Date().toISOString(),
        account_id: t.account_id || "unknown"
      }))
    };
    const { data } = await apiClient.post(`/api/v1/analyze`, agentState);
    return data;
  } catch (err) {
    console.error("Analytics Error:", err.response?.data || err.message);
    try {
      import('fs').then(fs => fs.writeFileSync('validation_error.json', JSON.stringify({
        error: err.response?.data,
        payload: agentState
      }, null, 2)));
    } catch (e) {}
    return { projections: [], anomalies: [], data_quality_score: 0.3, status: "degraded", message: "Analytics engine unavailable" };
  }
};

export const getLiquidityForecast = async (agentId) => {
  const { data } = await apiClient.get(`/forecasts/agent/${agentId}`);
  return data;
};

export default apiClient;