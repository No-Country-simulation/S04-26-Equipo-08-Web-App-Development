import multer from "multer";
import path from "path";
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".jpg", ".jpeg", ".png", ".pdf"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error("Unsupported format, we only admit JPG, PNG, PDF AND JPEG"),
      false,
    );
  }
};
export const upload = multer({
  storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
