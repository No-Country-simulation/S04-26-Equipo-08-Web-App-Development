import { documentUploadHandler } from "../../handlers/Phases/documentUploadH.js";
import { Router } from "express";
import { upload } from "../../middlewares/uploadMiddleware.js";
import { authenticateToken } from "../../utils/jwt.js";

const documentURoutes = Router();

documentURoutes.post(
  "/doc_upload",
  upload.single("file"),
  authenticateToken,
  documentUploadHandler,
);

export default documentURoutes;
