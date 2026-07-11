let io = null;

export const setSocketInstance = (socketIo) => {
  io = socketIo;
};

export const dispatchAlert = (alert, caseData) => {
  if (!io) return;
  const { agent_id, provider_id, severity } = alert;
  io.to(`agent:${agent_id}`).emit("alert:new", { alert, case: caseData, localizedTitle: { bn: alert.title_bn, en: alert.title_en, banglish: alert.title_banglish } });
  if (provider_id) io.to(`provider:${provider_id}`).emit("alert:provider", { alert, case: caseData });
  if (severity === "critical" || severity === "high") io.to("role:area_manager").emit("alert:area", { alert, case: caseData });
};

export const dispatchEscalation = (caseData, escalatedTo) => {
  if (!io) return;
  io.to(`role:${escalatedTo}`).emit("case:escalated", caseData);
  io.to(`case:${caseData.id}`).emit("case:updated", caseData);
};