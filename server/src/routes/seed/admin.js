import { Router } from "express";
import { seedAdmin } from "../../controllers/seed/seedAdmin.js";


const adminRoutes = Router();

adminRoutes.post("/seed-admin", seedAdmin);

export default adminRoutes;