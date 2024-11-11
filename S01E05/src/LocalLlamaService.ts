import ollama from 'ollama';

export class LocalLlamaService {
    private localLlamaModel: string;

    constructor(localLlamaModel: string) {
        this.localLlamaModel = localLlamaModel
    }

    async createCompletion(userPrompt: string, systemPrompt: string) {
        const response = await ollama.chat({
            model: this.localLlamaModel,
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
            stream: false,
        })
        return response.message.content
    }
}