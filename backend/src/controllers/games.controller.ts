import { Request, Response } from "express";
import "multer";
import { GameService } from "../services/games.service";

// S3
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { bucketName, s3Client } from "../config/s3";

export const GameController = {
  async create(req: Request, res: Response) {
    try {
      const { title, platform, status_game } = req.body ?? {};

      // const homepage_url = req.file ? `/uploads/${req.file.filename}` : null;

      // ==========================================
      // VERSIÓN AWS S3
      // ==========================================
      let homepage_url = null;
      if (req.file) {
        const keyName = `homepages/${Date.now()}-${req.file.originalname}`;

        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: keyName,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        });

        await s3Client.send(command);
        // Armamos la URL pública de S3
        homepage_url = `https://${bucketName}.s3.amazonaws.com/${keyName}`;
      }

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

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, platform, status_game } = req.body ?? {};

    if (isNaN(Number(id)))
      return res.status(400).json({ error: "ID inválido" });

    try {
      let homepage_url = null;
      if (req.file) {
        const keyName = `homepages/${Date.now()}-${req.file.originalname}`;
        await s3Client.send(
          new PutObjectCommand({
            Bucket: bucketName,
            Key: keyName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
          }),
        );
        homepage_url = `https://${bucketName}.s3.amazonaws.com/${keyName}`;
      }

      const updatedGame = await GameService.updateGame({
        g_id: Number(id),
        title,
        platform,
        status_game,
        homepage_url,
      });

      if (!updatedGame)
        return res
          .status(404)
          .json({ error: "Juego no encontrado para actualizar" });

      res.json({
        message: "Juego actualizado correctamente",
        game: updatedGame,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno al actualizar el juego" });
    }
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    if (isNaN(Number(id)))
      return res.status(400).json({ error: "ID inválido" });

    try {
      const deletedGame = await GameService.deleteGame(Number(id));

      if (!deletedGame)
        return res
          .status(404)
          .json({ error: "Juego no encontrado para eliminar" });

      res.json({
        message:
          "Juego eliminado correctamente junto con su historial de horas",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno al eliminar el juego" });
    }
  },
};
