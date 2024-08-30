import { error } from "console";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNCHRONIZE === "true",
  logging: ["query", "error"],
  entities: [__dirname + "/entity/**/*.ts"],
  migrations: [__dirname + "/migration/**/*.ts"],
  subscribers: [__dirname + "/subscriber/**/*.ts"],
});
