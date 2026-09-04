import { unlink } from "node:fs/promises";
import path from "node:path";
import pool from "../config/database";

export const GameService = {
  async createGame(data: {
    title: string;
    platform: string;
    status_game: string;
    homepage_url: string | null;
  }) {
    const query = `INSERT INTO games (title, platform, game_status, homepage_url) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;`;

    const values = [
      data.title,
      data.platform,
      data.status_game,
      data.homepage_url,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async getGames() {
    const { rows } = await pool.query("SELECT * FROM games ORDER BY g_id DESC");
    return rows;
  },

  async updateGame(data: {
    g_id: number;
    title: string;
    platform: string;
    status_game: string;
    homepage_url: string | null;
  }) {
    let query = "";
    let values = [];

    if (data.homepage_url) {
      query = `
        UPDATE games 
        SET title = $1, platform = $2, game_status = $3, homepage_url = $4 
        WHERE g_id = $5 
        RETURNING *;
      `;
      values = [
        data.title,
        data.platform,
        data.status_game,
        data.homepage_url,
        data.g_id,
      ];
    } else {
      query = `
        UPDATE games 
        SET title = $1, platform = $2, game_status = $3 
        WHERE g_id = $4 
        RETURNING *;
      `;
      values = [data.title, data.platform, data.status_game, data.g_id];
    }

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async deleteGame(g_id: number) {
    const query = `DELETE FROM games WHERE g_id = $1 RETURNING *;`;
    const { rows } = await pool.query(query, [g_id]);
    const deletedGame = rows[0];

    if (deletedGame?.homepage_url) {
      const filename = path.basename(deletedGame.homepage_url);
      const imagePath = path.join(process.cwd(), "uploads", filename);

      try {
        await unlink(imagePath);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
          console.error("Error al eliminar la imagen del juego", error);
        }
      }
    }

    return deletedGame;
  },
};
