export const SLA_MATRIX = {
  liquidity_critical: { minutes: 30, firstResponder: "agent", escalation: ["field_officer", "area_manager", "ops_team"] },
  liquidity_high: { minutes: 60, firstResponder: "agent", escalation: ["field_officer", "ops_team"] },
  anomaly_high: { minutes: 120, firstResponder: "ops_team", escalation: ["risk_analyst"] },
  anomaly_medium: { minutes: 240, firstResponder: "ops_team", escalation: ["area_manager"] },
  data_quality: { minutes: 60, firstResponder: "ops_team", escalation: ["ops_team"] },
};