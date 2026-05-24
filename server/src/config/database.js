import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const db = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DATABASE_URL_LOCAL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

export const checkDatabase = async () => {
  try {
    const client = await db.connect();

    console.log("✅ PostgreSQL connected");

    const result = await client.query("SELECT NOW()");

    console.log("🕒 DB Time:", result.rows[0]);

    client.release();
  } catch (error) {
    
    console.error("❌ PostgreSQL error:");

    console.error(error.message);

    throw error;
  }
};
