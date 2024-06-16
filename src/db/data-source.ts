import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_PORT = process.env.DATABASE_PORT;
const DATABASE_DB = process.env.DATABASE_DB;
if (
  !DATABASE_HOST ||
  !DATABASE_USER ||
  !DATABASE_PASSWORD ||
  !DATABASE_PORT ||
  !DATABASE_DB
) {
  throw new Error('Enviroment Database Error');
}

const source = new DataSource({
  type: 'mysql',
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT),
  username: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_DB,
  entities: ['src/db/**/*.entity.ts'],
  migrations: ['src/db/migrations/**/*.ts'], // フォルダを作成すること
  synchronize: false,
});
export default source;
