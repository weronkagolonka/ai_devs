import dotenv from 'dotenv'
import { cleanEnv, str } from 'envalid'

dotenv.config()

export const config = cleanEnv(process.env, {
    ENDPOINT_URL: str(),
    OPEN_API_KEY: str(),
})
