import express from "express";
import testRoutes from "./routes/test.routes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use(errorMiddleware);
app.use("/api", testRoutes);

export default app;
