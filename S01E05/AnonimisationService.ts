import { LocalLlamaService } from "./LocalLlamaService";
import { systemPrompt } from "./prompt";

export class AnonimisationService {
    private reportUrl: string;
    private agentDataUrl: string;
    private apiKey: string;
    private localLlamaService: LocalLlamaService

    constructor(reportUrl: string, apiKey: string, localLlamaService: LocalLlamaService) {
        this.reportUrl = reportUrl;
        this.agentDataUrl = `https://centrala.ag3nts.org/data/${apiKey}/cenzura.txt`;
        this.apiKey = apiKey;
        this.localLlamaService = localLlamaService
    }

    async getAgentData() {
        const response = await fetch(this.agentDataUrl);
        return response.text();
    }

    async reportAnonimisedAgentData(data: string) {
        const anonimisedData = await this.localLlamaService.createCompletion(data, systemPrompt);
        const response = await fetch(this.reportUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                task: "CENZURA",
                apikey: this.apiKey,
                answer: anonimisedData,
            }),
        });

        return response.json();
    }
}