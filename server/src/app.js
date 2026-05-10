import express from "express";
import testRoutes from "./routes/test.routes.js";
import usersRoutes from "./routes/users.routes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

app.use(express.json());

app.use("/api", testRoutes);
app.use("/api/users", usersRoutes);

app.use(errorMiddleware);

export default app;
