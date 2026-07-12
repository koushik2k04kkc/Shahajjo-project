export const TransactionEntity = {
  tableName: "transactions",
  columns: ["id", "agent_id", "provider_id", "transaction_type", "amount", "status", "customer_ref_hash", "metadata", "created_at"],
};