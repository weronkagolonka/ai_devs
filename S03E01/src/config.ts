import dotenv from "dotenv";
import { cleanEnv, str } from "envalid";

dotenv.config();

export const config = cleanEnv(process.env, {
    DOWNLOAD_FILES_ENDPOINT_URL: str(),
    REPORT_FILES_ENDPOINT_URL: str(),
    OPEN_API_KEY: str(),
    USER_API_KEY: str(),
});
