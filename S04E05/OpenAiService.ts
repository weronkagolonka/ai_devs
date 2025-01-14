import OpenAI from "openai";
import {
    OpenAiResponse,
    InvalidImage,
    ReportQuestionResponse,
    Questions,
    PdfDocumentContent,
    AnswerHistory,
} from "./types";
import { answerQuestionSystemPrompt } from "./prompts/answerQuestionSystemPrompt";

export class OpenAiService {
    private openAi: OpenAI;

    constructor(openAi: OpenAI) {
        this.openAi = openAi;
    }

    async getImageDescription(
        imageBuffer: Buffer,
        systemPrompt: string,
        model?: string
    ): Promise<OpenAiResponse> {
        const response = await this.openAi.chat.completions.create({
            model: model || "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/png;base64,${imageBuffer.toString(
                                    "base64"
                                )}`,
                            },
                        },
                    ],
                },
            ],
        });
        const data = response.choices[0].message.content || "";

        return JSON.parse(data) as OpenAiResponse;
    }

    async answerQuestions(
        questions: Questions,
        notebookContents: PdfDocumentContent,
        history?: AnswerHistory
    ): Promise<OpenAiResponse> {
        const response = await this.openAi.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: answerQuestionSystemPrompt(
                        JSON.stringify(notebookContents),
                        JSON.stringify(history)
                    ),
                },
                {
                    role: "user",
                    content: JSON.stringify(questions),
                },
            ],
        });

        const data = response.choices[0].message.content || "";
        return JSON.parse(data) as OpenAiResponse;
    }
}
