import { duplicate } from "../redis.service.js";
import { escalateCase } from "../../modules/alert-router/sla/sla-escalation.service.js";

const PREFIX = "sla:case:";

export const startSlaListener = (io) => {
  const sub = duplicate();
  sub.config("SET", "notify-keyspace-events", "Ex").catch(() => {});
  sub.subscribe("__keyevent@0__:expired").catch(() => {});

  sub.on("message", async (channel, message) => {
    if (!message.startsWith(PREFIX)) return;
    const caseId = message.replace(PREFIX, "");
    const result = await escalateCase(caseId, "sla_breach");
    if (result && io) {
      io.to(`case:${caseId}`).emit("case:escalated", result);
      io.to(`role:${result.escalatedTo}`).emit("case:assigned", result);
    }
  });
};

export const setSlaTimer = async (caseId, seconds, payload) => {
  const redis = (await import("../redis.module.js")).default;
  await redis.setex(`${PREFIX}${caseId}`, seconds, JSON.stringify(payload));
};

export const cancelSlaTimer = async (caseId) => {
  const redis = (await import("../redis.module.js")).default;
  await redis.del(`${PREFIX}${caseId}`);
};

export const getSlaStatus = async (caseId) => {
  const redis = (await import("../redis.module.js")).default;
  const t = await redis.ttl(`${PREFIX}${caseId}`);
  return { caseId, secondsRemaining: t, breached: t <= 0 };
};