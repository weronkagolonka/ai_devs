import dotenv from "dotenv";
import { cleanEnv, num, str } from "envalid";

dotenv.config();

export const config = cleanEnv(process.env, {
    DOWNLOAD_FILES_ENDPOINT_URL: str(),
    REPORT_ANSWER_ENDPOINT_URL: str(),
    USER_API_KEY: str(),
    OPEN_API_KEY: str(),
    QDRANT_PORT: num(),
    ARCHIVE_PASSWORD: str(),
});
