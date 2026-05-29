import {Router} from "express";
import { getDocHandler } from "../../handlers/Operator/getDocHandler.js";
import { authenticateToken } from "../../utils/jwt.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";
import { docEvaluationHandler } from "../../handlers/Operator/docEvaluationHandler.js";
import { getStatsHandler } from "../../handlers/Admin/getStatsHandler.js";

const operatorRoutes = Router();

operatorRoutes.get("/docs", authenticateToken, authorizeRole("admin", "operator"), getDocHandler);
operatorRoutes.patch("/evaluation", authenticateToken, authorizeRole("admin", "operator"), docEvaluationHandler);
operatorRoutes.get("/stats", authenticateToken, authorizeRole("admin", "operator"), getStatsHandler);

export default operatorRoutes;