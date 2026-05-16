import fs from "fs";
import path from "path";

import { db } from "../config/database.js";

export const runMigrations = async () => {
  try {
    console.log("🚀 Running database migrations...");

    //const __dirname = path
    //  .dirname(new URL(import.meta.url).pathname)
    //  .replace(/^\/([a-zA-Z]:)/, "$1");
    //console.log(__dirname);
    const __dirname = process.env.RELATIVE_PATH
    const initPath = path.join(__dirname, "init.sql");
    console.log(__dirname);
    const schemaPath = path.join(__dirname, "schema.sql");

    const seedPath = path.join(__dirname, "seed.sql");

    console.log("📄 init.sql:", initPath);

    console.log("📄 schema.sql:", schemaPath);

    console.log("📄 seed.sql:", seedPath);

    const initSQL = fs.readFileSync(initPath, "utf8");

    const schemaSQL = fs.readFileSync(schemaPath, "utf8");

    const seedSQL = fs.readFileSync(seedPath, "utf8");

    await db.query(initSQL);

    console.log("✅ init.sql executed");

    await db.query(schemaSQL);

    console.log("✅ schema.sql executed");

    await db.query(seedSQL);

    console.log("✅ seed.sql executed");
  } catch (error) {
    console.error("❌ Migration error:");

    console.error(error);
  }
};
