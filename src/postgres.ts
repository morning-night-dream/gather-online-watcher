import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";
import { getConfig } from "./config.ts";

const config = getConfig();

export const postgresClient = new Client({
  user: config.postgres.DB_USER,
  database: config.postgres.DB_NAME,
  hostname: config.postgres.DB_HOST,
  port: config.postgres.DB_PORT,
  password: config.postgres.DB_PASSWORD,
});

await postgresClient.connect();
