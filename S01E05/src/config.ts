
import dotenv from "dotenv"
import { cleanEnv, str } from "envalid"

dotenv.config()

export const config = cleanEnv(process.env, {
    REPORT_ENDPOINT_URL: str(),
    USER_API_KEY: str(),
    LLAMA_MODEL: str(),
})

