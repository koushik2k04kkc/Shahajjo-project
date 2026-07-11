import { query } from "../../database/database.module.js";

export const findById = async (id, providerId = null) => {
  const result = await query("SELECT * FROM cases WHERE id = $1", [id], providerId);
  return result.rows[0];
};

export const updateStatus = async (id, status, providerId = null) => {
  const result = await query("UPDATE cases SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *", [status, id], providerId);
  return result.rows[0];
};