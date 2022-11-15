import "reflect-metadata";
import { DataSource } from "typeorm";
import { Account } from "../models/Account";
import { User } from "../models/User";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "docker",
  database: "db",
  entities: [User, Account],
  synchronize: true,
  logging: false,
});

AppDataSource.initialize()
  .catch((error) => console.error(error));