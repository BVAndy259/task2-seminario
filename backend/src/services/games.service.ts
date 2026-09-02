import pool from "../config/database";

export const createGame = async (
  title: string,
  platform: string,
  status_game: string,
  homepage_url: string | null,
) => {
  const query = `INSERT INTO games (title, platform, status_game, homepage_url) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *;`;

  const values = [title, platform, status_game, homepage_url];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getGames = async () => {
  const { rows } = await pool.query("SELECT * FROM games ORDER BY g_id DESC");
  return rows;
};
