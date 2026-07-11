import axios from "axios";
import { config } from "../config/configuration.js";

const apiClient = axios.create({
  baseURL: config.analyticsUrl,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

export const analyzeAgent = async (agentId, transactions, balances) => {
  try {
    const { data } = await apiClient.post(`/analyze/agent/${agentId}`, { transactions, balances, timestamp: new Date().toISOString() });
    return data;
  } catch (err) {
    return { projections: [], anomalies: [], data_quality_score: 0.3, status: "degraded", message: "Analytics engine unavailable" };
  }
};

export const getLiquidityForecast = async (agentId) => {
  const { data } = await apiClient.get(`/forecasts/agent/${agentId}`);
  return data;
};

export default apiClient;