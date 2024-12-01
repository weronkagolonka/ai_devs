import { cleanEnv, str } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

export const config = cleanEnv(process.env, {
  DATA_SOURCE_ENDPOINT: str(),
  TARGET_ENDPOINT: str(),
  TASK_NAME: str({ default: 'POLIGON' }),
  API_KEY: str(),
}); 