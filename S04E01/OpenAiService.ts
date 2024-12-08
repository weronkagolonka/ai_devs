import OpenAI from "openai";
import { OpenAIResponse } from "./types";
import { ChatCompletionUserMessageParam } from "openai/resources";

export class OpenAIService {
    private openAiClient: OpenAI;

    constructor(openAI: OpenAI) {
        this.openAiClient = openAI;
    }

    /**
     *
     * @param input A text query or an array of image URLs
     * @param prompt A system prompt
     * @returns Completion response
     */
    async getCompletion(
        input: string[],
        images: boolean,
        prompt: string,
        model: string = "gpt-4o-mini"
    ): Promise<OpenAIResponse> {
        const userMessage: ChatCompletionUserMessageParam = images
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
                  content: input.map((i) => ({
                      text: i,
                      type: "text",
                  })),
              };

        const response = await this.openAiClient.chat.completions.create({
            model: model,
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
