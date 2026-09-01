import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool
  .connect()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error:", err.stack));

export default pool;
