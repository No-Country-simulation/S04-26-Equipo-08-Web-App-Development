import express from "express";
import testRoutes from "./routes/test.routes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
//import { sendTheWhats } from "./utils/whatsappSender.js";
import routes from "./routes/index.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import bodyParser from "body-parser";
import { authenticateToken } from "./utils/jwt.js";
dotenv.config();

const app = express();

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
app.use(authenticateToken());
app.use("/", routes);
app.use(errorMiddleware);

//sendTheWhats();
//app.use("/api", testRoutes);

export default app;
