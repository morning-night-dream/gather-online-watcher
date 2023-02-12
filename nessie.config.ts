import {
  ClientPostgreSQL,
  NessieConfig,
} from "https://deno.land/x/nessie@2.0.10/mod.ts";
import { getConfig } from "./config.ts";

const config = getConfig();

/** Select one of the supported clients */
const client = new ClientPostgreSQL({
  database: config.postgres.DB_NAME,
  hostname: config.postgres.DB_HOST,
  port: config.postgres.DB_PORT,
  user: config.postgres.DB_USER,
  password: config.postgres.DB_PASSWORD,
});

/** This is the final config object */
const nessieConfig: NessieConfig = {
  client,
  migrationFolders: ["./db/migrations"],
  seedFolders: ["./db/seeds"],
};

export default nessieConfig;
