import { publish } from "../redis.service.js";

export const emitTransactionEvent = async (transaction) => {
  await publish("transaction.stream", JSON.stringify(transaction));
};

export const emitAlertEvent = async (alert) => {
  await publish("alert.new", JSON.stringify(alert));
};