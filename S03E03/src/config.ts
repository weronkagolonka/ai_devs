import dotenv from "dotenv";
import { cleanEnv, str } from "envalid";

dotenv.config();

export const config = cleanEnv(process.env, {
    REPORT_ANSWER_ENDPOINT_URL: str(),
    API_ENDPOINT_URL: str(),
    OPEN_API_KEY: str(),
    USER_API_KEY: str(),
});
