import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: process.env.DB_LOGIN,
    password: process.env.DB_PASSWORD,
    host: process.env.HOST,
    port: parseInt(process.env.DB_EXTERNAL_PORT || '5432'),
    database: process.env.DATABASE_NAME
});
