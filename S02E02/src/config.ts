
import dotenv from "dotenv"
import { cleanEnv, str } from "envalid"

dotenv.config()

export const config = cleanEnv(process.env, {
    OPEN_API_KEY: str(),
})

