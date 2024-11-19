
import dotenv from "dotenv"
import { cleanEnv, str } from "envalid"

dotenv.config()

export const config = cleanEnv(process.env, {
    DOWNLOAD_ARTICLE_URL: str(),
    REPORT_DATA_URL: str(),                                                 
    USER_API_KEY: str(),
    OPEN_API_KEY: str(),
})

