import dotenv from "dotenv";

dotenv.config();

export const SALT_WORK_FACTOR = 10;
export const EXPIRES_IN = "1m";

export const {
  TOKEN_KEY,
  MONGO_URI,
  API_PORT,
  FILE_SERVER_URI,
  FILE_SERVER_USERNAME,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_DB
} = process.env;