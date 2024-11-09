import OpenAI from "openai";

export class OpenAiService {
    private openAI: OpenAI;

    constructor(openAI: OpenAI) {
        this.openAI = openAI;
    }

    async correctFileContent(systemPrompt: string, userPrompt: string) {
        const response = await this.openAI.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: userPrompt,
                }
            ],
        })
        return response.choices[0].message.content;
    }
}