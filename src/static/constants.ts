import dotenv from "dotenv";

dotenv.config();

export const SALT_WORK_FACTOR = 10;
export const EXPIRES_IN = "1d";

export const { TOKEN_KEY, MONGO_URI, API_PORT, FILE_SERVER_URI, FILE_SERVER_USERNAME } = process.env;