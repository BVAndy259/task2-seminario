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
};
