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

const upload = multer({ storage });

router.post("/", upload.single("portada"), GameController.create);
router.get("/", GameController.getAll);
router.put("/:id", GameController.update);
router.delete("/:id", GameController.delete);

export default router;
