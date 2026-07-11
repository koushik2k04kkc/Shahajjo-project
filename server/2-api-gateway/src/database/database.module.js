import pg from "pg";
const { Pool } = pg;
import { config } from "../config/configuration.js";

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.name,
  user: config.db.user,
  password: config.db.password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("connect", (client) => {
  client.query("SET app.current_provider_id = NULL").catch(() => {});
});

export const query = async (text, params, providerId = null) => {
  const client = await pool.connect();
  try {
    if (providerId) {
      await client.query("SET app.current_provider_id = $1", [providerId]);
    }
    const result = await client.query(text, params);
    return result;
  } finally {
    if (providerId) {
      await client.query("SET app.current_provider_id = NULL").catch(() => {});
    }
    client.release();
  }
};

export const getClient = () => pool.connect();
export default pool;