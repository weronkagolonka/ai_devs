import dotenv from "dotenv";
import { cleanEnv, num, str } from "envalid";

dotenv.config();

export const globalConfig = cleanEnv(process.env, {
    OPEN_API_KEY: str(),
    USER_API_KEY: str(),
    REPORT_ANSWER_URL: str(),

    // S01E01
    ENDPOINT_URL: str(),
    WEBSITE_USERNAME: str(),
    WEBSITE_PASSWORD: str(),

    // S01E02
    VERIFY_ENDPOINT_URL: str(),

    // S01E05
    LLAMA_MODEL: str(),

    // S02E01
    DOWNLOAD_RECORDING_URL: str(),

    // S02E04
    DOWNLOAD_ZIP_URL: str(),

    // S02E05
    DOWNLOAD_ARTICLE_URL: str(),

    // S03E02
    QDRANT_PORT: num(),
    ARCHIVE_PASSWORD: str(),

    // S03E03
    DB_API_URL: str(),

    // S03E04
    SEARCH_PEOPLE_URL: str(),
    SEARCH_PLACES_URL: str(),
    BARABARA_DATA_URL: str(),

    // S03E05
    NEO4J_URL: str(),
    NEO4J_USERNAME: str(),
    NEO4J_PASSWORD: str(),

    // S04E02
    FINE_TUNED_MODEL: str(),
});
