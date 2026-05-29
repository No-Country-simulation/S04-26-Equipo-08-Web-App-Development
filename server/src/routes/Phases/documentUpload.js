import { documentUploadHandler } from "../../handlers/Phases/documentUploadH.js";
import { Router } from "express";
import { upload } from "../../middlewares/uploadMiddleware.js";
import { authenticateToken } from "../../utils/jwt.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

const documentURoutes = Router();

documentURoutes.post(
  "/doc_upload",
  authenticateToken,
  authorizeRole("contractor"),
  upload.single("file"),
  documentUploadHandler,
);

export default documentURoutes;
