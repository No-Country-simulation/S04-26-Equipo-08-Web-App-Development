import { Router } from "express";
import authRoutes from "./Auth/auth.js";
import documentURoutes from "./Phases/documentUpload.js";

const routes = Router();

routes.use(authRoutes);
routes.use(documentURoutes);
export default routes;
