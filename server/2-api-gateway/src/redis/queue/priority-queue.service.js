import redis from "../redis.module.js";

export const enqueueCase = async (caseId, priority, data) => {
  await redis.zadd("case:queue", priority, JSON.stringify({ caseId, ...data }));
};

export const dequeueCase = async () => {
  const items = await redis.zpopmin("case:queue");
  return items.length ? JSON.parse(items[0]) : null;
};

export const getQueue = async (start = 0, stop = 100) => {
  const items = await redis.zrange("case:queue", start, stop, "WITHSCORES");
  return items;
};