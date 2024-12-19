import OpenAI from "openai";
import { getDronLocationSystemPrompt } from "./prompts";
import { OpenAiResponse } from "./types";

export class OpenAiService {
    private openAI: OpenAI;

    constructor(openAI: OpenAI) {
        this.openAI = openAI;
    }

    async getDronLocation(flightInstructions: string): Promise<OpenAiResponse> {
        const response = await this.openAI.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: getDronLocationSystemPrompt,
                },
                {
                    role: "user",
                    content: flightInstructions,
                },
            ],
        });
        const data = response.choices[0].message.content || "";

        return JSON.parse(data) as OpenAiResponse;
    }
}
