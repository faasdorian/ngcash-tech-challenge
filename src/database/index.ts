import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { AccessToken } from "../models/AccessToken";
import { Account } from "../models/Account";
import { User } from "../models/User";
import { Transaction } from "../models/Transaction";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Account, AccessToken, Transaction],
  synchronize: true,
  logging: false,
});

AppDataSource.initialize().catch((error) => console.error(error));
