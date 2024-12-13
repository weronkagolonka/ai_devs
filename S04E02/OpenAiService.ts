import OpenAI from "openai";
import { constants } from "./constants";
import { globalConfig } from "../common/globalConfig";

export class OpenAiService {
    private openAi: OpenAI;

    constructor(openAi: OpenAI) {
        this.openAi = openAi;
    }

    async fineTunedCompletion(query: string) {
        const response = await this.openAi.chat.completions.create({
            model: globalConfig.FINE_TUNED_MODEL,
            messages: [
                {
                    role: "system",
                    content: constants.CLASSIFY_DATA_SYSTEM_MESSAGE,
                },
                {
                    role: "user",
                    content: query,
                },
            ],
        });

        return response.choices[0].message.content || "";
    }
}
