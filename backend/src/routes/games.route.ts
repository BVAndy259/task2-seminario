import { Router } from "express";
import multer from "multer";

const router = Router();

const upload = multer({ dest: "uploads/" });

// const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("portada"), async (req, res) => {
  try {
    const { title, platform, game_status } = req.body;

    const homepage_url = req.file ? `/uploads/${req.file.filename}` : null;

    // const newGame = await createGame(title, platform, game_status, homepage_url);

    res
      .status(201)
      .json({ message: "Game created", homepage_url: homepage_url });
  } catch (error) {
    res.status(500).json({ error: "Error creating the game" });
  }
});

export default router;
