import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/database";
import GameRouter from "./routes/games.route";
import RegisterRouter from "./routes/register.route";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/api/games", GameRouter);

app.use("/api/register", RegisterRouter);

app.get("/ping", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT NOW() AS hora_actual");
    res.json({
      estado: "API funcionando correctamente",
      hora_db: result.rows[0].hora_actual,
    });
  } catch (error) {
    console.error("Error en el endpoint /ping:", error);
    res.status(500).json({ error: "Error conectando a la base de datos" });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log(`Prueba la conexión a BD en: http://localhost:${port}/ping`);
});
