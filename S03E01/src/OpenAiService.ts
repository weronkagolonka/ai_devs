import OpenAI from "openai";
import { getFileMetadataSystemPrompt } from "./prompts";

export class OpenAiService {
    private openAiClient: OpenAI;

    constructor(openAiClient: OpenAI) {
        this.openAiClient = openAiClient;
    }

    async getFileMetadata(fileContent: string, facts: string) {
        const response = await this.openAiClient.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: [
                        {
                            type: "text",
                            text: getFileMetadataSystemPrompt(facts),
                        }
                    ],
                },
                {
                    role: "user",
                    content: fileContent,
                },
            ],
        });

        return response.choices[0].message.content || "";
    }
}
