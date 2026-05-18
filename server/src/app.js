import express from "express";
import cors from "cors";
import testRoutes from "./routes/test.routes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
//import { sendTheWhats } from "./utils/whatsappSender.js";
import routes from "./routes/index.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import bodyParser from "body-parser";
dotenv.config();

const app = express();

// Configuración CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Puerto por defecto de Vite
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: "GET, POST, OPTIONS, PUT, PATCH, DELETE",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  }),
);
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(morgan("dev"));
app.use("/", routes);
app.use(errorMiddleware);

//sendTheWhats();
//app.use("/api", testRoutes);

export default app;
