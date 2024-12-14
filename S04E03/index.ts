import OpenAI from "openai";
import { globalConfig } from "../common/globalConfig";
import { Question } from "./types";
import { OpenAiService } from "./OpenAiService";
import { WebScrapper } from "./WebScrapper";
import { ReportService } from "../common/ReportService";

const main = async () => {
    const openAiClient = new OpenAI({
        apiKey: globalConfig.OPEN_API_KEY,
    });
    const openAiService = new OpenAiService(openAiClient);
    const webScrapper = new WebScrapper(openAiService);
    const reportService = new ReportService();

    const response = await fetch(
        `https://centrala.ag3nts.org/data/${globalConfig.USER_API_KEY}/softo.json`
    );
    const data = await response.json();
    const questions = Object.keys(data).map(
        (key) =>
            ({
                id: key,
                question: data[key],
            } as Question)
    );

    const answers = await Promise.all(
        questions.map(async (question) => await webScrapper.getAnwser(question))
    );
    const reportAnswer: { [key: string]: string } = {};
    answers.forEach((answer) => {
        reportAnswer[answer.id] = answer.content;
    });

    const reportResponse = await reportService.reportAnswer(
        "softo",
        reportAnswer
    );
    console.log(reportResponse.message);
};

main();
