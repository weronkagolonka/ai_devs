import OpenAI from "openai";
import { getAnswersystemPrompt } from "./prompts";
import { Answer, OpenAiResponse } from "./types";

export class OpenAiService {
    private openAi: OpenAI;

    constructor(openAI: OpenAI) {
        this.openAi = openAI;
    }

    async getAnswerOrRedirect(
        pageContent: string,
        question: string,
        homePageUrl: string,
        links: string[] = []
    ) {
        const response = await this.openAi.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: getAnswersystemPrompt(
                        question,
                        homePageUrl,
                        links
                    ),
                },
                {
                    role: "user",
                    content: pageContent,
                },
            ],
        });

        const data = response.choices[0].message.content || "";
        return JSON.parse(data) as OpenAiResponse;
    }
}
