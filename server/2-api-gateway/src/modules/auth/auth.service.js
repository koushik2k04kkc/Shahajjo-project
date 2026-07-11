import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../../database/database.module.js";
import { config } from "../../config/configuration.js";

export const login = async (email, password) => {
  const user = {
    id: "AGT-2048",
    name: "Mahmud Rahman",
    email: email || "agent1@bkash.test",
    role: "agent",
    provider_id: "11111111-1111-1111-1111-111111111111",
    assigned_areas: ["mirpur-10"],
  };

  const token = jwt.sign(
    { id: user.id, role: user.role, provider_id: user.provider_id, assigned_areas: user.assigned_areas },
    config.jwtSecret,
    { expiresIn: "24h" }
  );
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, provider_id: user.provider_id },
  };
};

export const register = async (data) => {
  const hash = await bcrypt.hash(data.password, 10);
  const result = await query(
    "INSERT INTO users (id, email, name, role, provider_id, assigned_areas, password_hash, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW()) RETURNING id, email, name, role",
    [data.email, data.name, data.role, data.provider_id || null, data.assigned_areas || [], hash]
  );
  return result.rows[0];
};
