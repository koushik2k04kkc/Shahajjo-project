import Redis from "ioredis";
import { config } from "../config/configuration.js";

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err));

export default redis;