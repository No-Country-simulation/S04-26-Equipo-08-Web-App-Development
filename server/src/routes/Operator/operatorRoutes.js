import {Router} from "express";
import { getDocHandler } from "../../handlers/Operator/getDocHandler";
import {authenticateToken} from "../../utils/jwt"
import { docEvaluationHandler } from "../../handlers/Operator/docEvaluationHandler";
const operatorRoutes = Router();

operatorRoutes.get("/docs", authenticateToken, getDocHandler);
operatorRoutes.patch("/evaluation", authenticateToken, docEvaluationHandler)