// db.js
import pkg from 'pg';
import 'dotenv/config';
const { Pool } = pkg;

export const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),             // default PostgreSQL port
  ssl: false,                // true if using cloud DB (Render, RDS, etc.)
  max: 5,                    // max connections
});
