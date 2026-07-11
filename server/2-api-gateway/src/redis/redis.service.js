import redis from "./redis.module.js";

export const get = async (key) => redis.get(key);
export const set = async (key, value, ttlSeconds = null) => {
  if (ttlSeconds) return redis.setex(key, ttlSeconds, value);
  return redis.set(key, value);
};
export const del = async (key) => redis.del(key);
export const ttl = async (key) => redis.ttl(key);
export const publish = async (channel, message) => redis.publish(channel, message);
export const subscribe = async (channel) => redis.subscribe(channel);
export const duplicate = () => redis.duplicate();

export default redis;