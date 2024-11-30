import OpenAI from "openai";
import { COMPLETION_QUERY } from "./constants";
import fs from "fs";
import { getQuerySystemPrompt } from "./prompt";

export class OpenAiService {
    private openAiClient: OpenAI;
    private cacheDirectory = "./cache";
    private queryFilePath = `${this.cacheDirectory}/query.sql`;

    constructor(openAiClient: OpenAI) {
        this.openAiClient = openAiClient;
    }

    async getDatabaseQuery(tableStructures: string[]) {
        const cachedQuery = this.openQueryFile();

        if (cachedQuery) {
            console.log("Using cached query");
            return cachedQuery;
        } else {
            const response = await this.openAiClient.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: getQuerySystemPrompt(tableStructures),
                    },
                    {
                        role: "user",
                        content: COMPLETION_QUERY,
                    },
                ],
            });

            const query = response.choices[0].message.content || "";

            fs.mkdirSync(this.cacheDirectory, { recursive: true });
            fs.writeFileSync(this.queryFilePath, query, {
                encoding: "utf8",
            });

            return query;
        }
    }

    private openQueryFile() {
        try {
            const data = fs.readFileSync(this.queryFilePath, "utf8");
            return data;
        } catch (error) {
            return undefined;
        }
    }
}
