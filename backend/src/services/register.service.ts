import pool from "../config/database";

export const RegisterServices = {
  async createRegister(data: {
    game_id: number;
    hours_played: number;
    registration_date: string;
    notes: string | null;
  }) {
    const query = `
        INSERT INTO time_log (game_id, hours_played, registration_date, notes)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [
      data.game_id,
      data.hours_played,
      data.registration_date,
      data.notes,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async getRegisterByGame(game_id: number) {
    const query = `
        SELECT * FROM time_log
        WHERE game_id = $1 
        ORDER BY registration_date DESC;
    `;
    const { rows } = await pool.query(query, [game_id]);
    return rows;
  },
};
