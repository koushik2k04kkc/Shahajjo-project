import { duplicate } from "../redis.service.js";

export const createSubscriber = () => {
  return duplicate();
};