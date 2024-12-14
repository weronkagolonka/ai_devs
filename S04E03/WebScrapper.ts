import { OpenAiService } from "./OpenAiService";
import { Answer, OpenAiResponse, Question } from "./types";
import fs from "fs";

export class WebScrapper {
    private url: string = "https://softo.ag3nts.org/";
    private opeAiService: OpenAiService;
    private logDirectory = "./S04E03/logs";

    constructor(opeAiService: OpenAiService) {
        this.opeAiService = opeAiService;
        fs.mkdirSync(this.logDirectory, { recursive: true });
    }

    async getAnwser(question: Question) {
        const logFilenName = `log-question-${question.id}.txt`;

        const homePageContent = await this.getPageContent(this.url);
        let finalAnswer: OpenAiResponse = await this.withLogging(
            logFilenName,
            async () => {
                return await this.opeAiService.getAnswerOrRedirect(
                    homePageContent,
                    question.question,
                    this.url
                );
            }
        );
        let visitedLinks: string[] = [];

        while (finalAnswer.answer.type !== "ANSWER") {
            const link = finalAnswer.answer.content;
            const nextPageContent = await this.getPageContent(link);
            visitedLinks.push(link);

            const answer = await this.withLogging(logFilenName, async () => {
                return await this.opeAiService.getAnswerOrRedirect(
                    nextPageContent,
                    question.question,
                    this.url,
                    visitedLinks
                );
            });

            finalAnswer = answer;
        }

        return {
            id: question.id,
            type: finalAnswer.answer.type,
            content: finalAnswer.answer.content,
        } as Answer;
    }

    private async withLogging(
        fileName: string,
        getData: () => Promise<OpenAiResponse>
    ): Promise<OpenAiResponse> {
        const data = await getData();
        fs.appendFileSync(
            `${this.logDirectory}/${fileName}`,
            `${JSON.stringify(data)}\n`,
            { encoding: "utf8" }
        );

        return data;
    }

    private async getPageContent(url: string) {
        const response = await fetch(url);
        return response.text();
    }
}
