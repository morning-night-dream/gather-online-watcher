import * as dotenv from "https://deno.land/std@0.167.0/dotenv/mod.ts";

await dotenv.config({
  export: true,
  // .env.exampleと、.env+通常の環境変数を比較して不足がないかチェック
  safe: true,
  example: ".env.example",
  path: ".env",
});

const config = Deno.env.toObject();

const GATHER_API_KEY = config["GATHER_API_KEY"];
if (!GATHER_API_KEY) {
  throw new Error("GATHER_API_KEY is empty");
}

const GATHER_SPACE_ID = config["GATHER_SPACE_ID"];
if (!GATHER_SPACE_ID) {
  throw new Error("GATHER_SPACE_ID is empty");
}

const SLACK_API_TOKEN = config["SLACK_API_TOKEN"];
if (!SLACK_API_TOKEN) {
  throw new Error("SLACK_API_TOKEN is empty");
}

const SLACK_CHANNEL_ID = config["SLACK_CHANNEL_ID"];
if (!SLACK_CHANNEL_ID) {
  throw new Error("SLACK_CHANNEL_ID is empty");
}

const SLACK_MESSAGE_TIMESTAMP = config["SLACK_MESSAGE_TIMESTAMP"];
if (!SLACK_MESSAGE_TIMESTAMP) {
  throw new Error("SLACK_MESSAGE_TIMESTAMP is empty");
}

const DB_NAME = config["DB_NAME"];
if (!DB_NAME) {
  throw new Error("DB_NAME is empty");
}

const DB_HOST = config["DB_HOST"];
if (!DB_HOST) {
  throw new Error("DB_HOST is empty");
}

const DB_PORT = config["DB_PORT"];
if (!DB_PORT) {
  throw new Error("DB_PORT is empty");
}

const DB_USER = config["DB_USER"];
if (!DB_USER) {
  throw new Error("DB_USER is empty");
}

const DB_PASSWORD = config["DB_PASSWORD"];
if (!DB_PASSWORD) {
  throw new Error("DB_PASSWORD is empty");
}

export const getConfig = () => {
  return {
    gather: {
      API_KEY: GATHER_API_KEY,
      SPACE_ID: GATHER_SPACE_ID,
    },
    slack: {
      API_TOKEN: SLACK_API_TOKEN,
      CHANNEL_ID: SLACK_CHANNEL_ID,
      SLACK_MESSAGE_TIMESTAMP: SLACK_MESSAGE_TIMESTAMP,
    },
    postgres: {
      DB_NAME: DB_NAME,
      DB_USER: DB_USER,
      DB_HOST: DB_HOST,
      DB_PORT: DB_PORT,
      DB_PASSWORD: DB_PASSWORD,
    },
  };
};
