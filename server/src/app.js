import express from "express";
import testRoutes from "./routes/test.routes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

app.use(express.json());

app.use(errorMiddleware);
app.use("/api", testRoutes);

export default app;
