import OpenAI from "openai";
import { OpenAIResponse } from "./types";
import { ChatCompletionUserMessageParam } from "openai/resources";

export class OpenAIService {
    private openAiClient: OpenAI;

    constructor(openAI: OpenAI) {
        this.openAiClient = openAI;
    }

    async getCompletion(input: string | string[], prompt: string) {
        const userMessage: ChatCompletionUserMessageParam =
            input instanceof Array
                ? {
                      role: "user",
                      content: input.map((i) => ({
                          image_url: {
                              url: i,
                          },
                          type: "image_url",
                      })),
                  }
                : {
                      role: "user",
                      content: input,
                  };

        const response = await this.openAiClient.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: prompt,
                },
                userMessage,
            ],
        });

        return JSON.parse(
            response.choices[0].message.content || ""
        ) as OpenAIResponse;
    }
}
