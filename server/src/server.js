import dotenv from "dotenv";

import app from "./app.js";

import { checkDatabase } from "./config/database.js";

import { runMigrations } from "./database/runMigrations.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {

    console.log("\n🚀 Starting NorthPay Backend...\n");

    // Verificar conexión DB
    await checkDatabase();

    // Ejecutar migraciones automáticas
    await runMigrations();

    // Iniciar servidor
    app.listen(PORT, () => {

      console.log("\n-----------------------------------");

      console.log(`✅ Server running on port ${PORT}`);

      console.log(`🌍 http://localhost:${PORT}`);

      console.log("-----------------------------------\n");

    });

  } catch (error) {

    console.error("❌ Fatal server error:");

    console.error(error.message);

  }
};

startServer();