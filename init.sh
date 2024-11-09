NEW_DIR=$1

PACKAGE_JSON='
{
  "name": "'${NEW_DIR,,}'",
  "version": "1.0.0",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "npx tsx src/index.ts",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "devDependencies": {
    "@types/node": "^22.9.0",
    "tsx": "^4.19.2",
    "typescript": "^5.6.3"
  },
  "dependencies": {
    "dotenv": "^16.4.5",
    "envalid": "^8.0.0",
    "openai": "^4.71.1"
  }
}
'

TS_CONFIG_JSON='
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
'

CONFIG_TS='
import dotenv from "dotenv"
import { cleanEnv, str } from "envalid"

dotenv.config()

export const config = cleanEnv(process.env, {
    ENDPOINT_URL: str(),
    OPEN_API_KEY: str(),
})
'

mkdir $NEW_DIR
cd $NEW_DIR
mkdir src
touch src/index.ts

echo "$PACKAGE_JSON" > package.json
npm install

echo "$CONFIG_TS" > src/config.ts
