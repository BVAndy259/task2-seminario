import { Request, Response } from "express";
import "multer";
import { GameService } from "../services/games.service";

export const GameController = {
  async create(req: Request, res: Response) {
    try {
      const { title, platform, status_game } = req.body;

      const homepage_url = req.file ? `/uploads/${req.file.filename}` : null;

      const newGame = await GameService.createGame({
        title,
        platform,
        status_game,
        homepage_url,
      });
      res
        .status(201)
        .json({ message: "Juego guardado correctamente", game: newGame });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno al crear el juego" });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const games = await GameService.getGames();
      res.json(games);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener el listado de juegos" });
    }
  },
};
