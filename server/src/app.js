import express from "express";
import cors from "cors";
import testRoutes from "./routes/test.routes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
//import { sendTheWhats } from "./utils/whatsappSender.js";
import routes from "./routes/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import bodyParser from "body-parser";
import adminRoutes from "./routes/seed/admin.js";
import { authenticateToken } from "./utils/jwt.js";
dotenv.config();

const app = express();

// Configuración CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use("/api/v1", routes);

//sendTheWhats();
//app.use("/api/v1", testRoutes);

//Rutas 

app.use('/api/v1/seed', adminRoutes)

app.use(errorMiddleware);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

export default app;
