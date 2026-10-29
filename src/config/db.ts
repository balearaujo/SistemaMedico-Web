import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_NAME'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error('[Error RS-10]: Falta definir la variable de entorno ${envVar} en el archivo .env');
  }
}

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

export async function testConnection() {
  const connection = await pool.getConnection();
  const [rows] = await connection.query('SELECT DATABASE() AS db_actual, VERSION() AS version_mysql');
  connection.release();
  return (rows as any[])[0];
}

export default pool;
