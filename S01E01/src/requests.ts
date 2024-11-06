import OpenAI from "openai";
import { LogInRequest } from "./types.js";
import { userPrompt } from "./prompt.js";

export const getLoginQuestion = async (endpoint: string) => {
    const response = await fetch(endpoint);
    return response.text();
}

export const getAnswer = async (client: OpenAI, pageHtml: string) => {
    const completionResponse = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: userPrompt(pageHtml)
            }
        ]
    })
    return completionResponse.choices[0].message.content;
}

export const logIn = async (endpoint: string, requestBody: LogInRequest) => {
    const response = await fetch(endpoint, {
        method: 'POST',
        body: new URLSearchParams(requestBody),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return response.text();
}