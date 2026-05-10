import express from "express";
import cors from "cors";
import testRoutes from "./routes/test.routes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

// Configuración CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Puerto por defecto de Vite
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(errorMiddleware);
app.use("/api", testRoutes);

export default app;
