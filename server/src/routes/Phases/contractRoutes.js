import { Router } from "express";
import { contractSignHandler } from "../../handlers/Phases/contractSignH.js";
import { contractCompleteHandler } from "../../handlers/Phases/contractCompleteH.js";
import { authenticateToken } from "../../utils/jwt.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

const contractRoutes = Router();

contractRoutes.post(
  "/contract-sign",
  authenticateToken,
  authorizeRole("contractor"),
  contractSignHandler,
);

contractRoutes.post(
  "/contract-sign/complete",
  authenticateToken,
  authorizeRole("contractor"),
  contractCompleteHandler,
);

export default contractRoutes;
