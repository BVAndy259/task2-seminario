import { Request, Response } from "express";
import "multer";
import { RegisterServices } from "../services/register.service";

export const RegisterController = {
  async create(req: Request, res: Response) {
    try {
      const { game_id, hours_played, registration_date, notes } = req.body;

      if (!game_id || hours_played === undefined || !registration_date) {
        return res.status(400).json({
          error:
            "Los campos game_id, hours_played y registration_date son obligatorios",
        });
      }

      const newRegister = await RegisterServices.createRegister({
        game_id,
        hours_played,
        registration_date,
        notes,
      });
      res.status(201).json({
        message: "Horas registradas con éxito",
        register: newRegister,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error interno al guardar las horas" });
    }
  },

  async getByGame(req: Request, res: Response) {
    try {
      const { gameId } = req.params;

      const register = await RegisterServices.getRegisterByGame(
        Number(gameId),
      );
      res.json(register);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
};
