import { Router } from "express";
import multer from "multer";
import path from "path";
import { GameController } from "../controllers/games.controller";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const uniqueName = `${Date.now()}${extension}`;
    cb(null, uniqueName);
  },
});

// const upload = multer({ storage });

// VERSIÓN AWS S3
const storageS3 = multer.memoryStorage();
const upload = multer({ storage: storageS3 });

router.post("/", upload.single("portada"), GameController.create);
router.get("/", GameController.getAll);
router.put("/:id", upload.single("portada"), GameController.update);
router.delete("/:id", GameController.delete);

export default router;
