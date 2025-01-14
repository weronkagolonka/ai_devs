import readline from "readline";
import { OpenAiService } from "./OpenAiService";
import { LocalJsonCache } from "../common/LocalJsonCache";
import { ReportService } from "../common/ReportService";
import { PdfService } from "./PdfService";
import { globalConfig } from "../common/globalConfig";
import {
    AnswerHistory,
    Answers,
    PdfDocumentContent,
    Questions,
    ReportQuestionResponse,
} from "./types";
import { re } from "mathjs";

export class UserInterface {
    private rl: readline.Interface;
    private reportService: ReportService;
    private openAiService: OpenAiService;

    constructor(reportService: ReportService, openAiService: OpenAiService) {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        this.reportService = reportService;
        this.openAiService = openAiService;
    }

    async exec(pdfContent: PdfDocumentContent) {
        console.log("Donwloading questions...");
        const quetionResponse = await fetch(
            `https://centrala.ag3nts.org/data/${globalConfig.USER_API_KEY}/notes.json`
        );
        const questionData = (await quetionResponse.json()) as Questions;
        console.log(`Questions:\n${JSON.stringify(questionData)}\n`);

        let counter = 1;

        console.log(`Answering questions, attempt ${counter}`);
        let answerQuestionsResponse = await this.openAiService.answerQuestions(
            questionData,
            pdfContent
        );
        let parsedAnswers = answerQuestionsResponse.answer as Answers;
        console.log(`Answers:\n${JSON.stringify(answerQuestionsResponse)}\n`);

        let reportResponse = (await this.reportService.reportAnswer(
            "notes",
            parsedAnswers
        )) as ReportQuestionResponse;

        let history: AnswerHistory = {
            attempt: 0,
            correctAnswers: {},
            forbiddenAnswers: {},
            hint: "",
        };

        while (reportResponse.code !== 0) {
            counter++;
            console.log(
                `One or more questions were not answered correctly: ${reportResponse.message}, ${reportResponse.hint}`
            );
            const shouldRepeat = await this.confirmAction(
                "Do you want to try again with answer history? (y/n)"
            );
            if (shouldRepeat.toLowerCase() !== "y") {
                break;
            } else {
                console.log(`Attempt ${counter}\n`);
                const incorrectQuestionNumber =
                    reportResponse.message.split(" ")[3];

                const forbiddenAnswers =
                    history.forbiddenAnswers[incorrectQuestionNumber] || [];
                forbiddenAnswers.push(parsedAnswers[incorrectQuestionNumber]);

                const {
                    [incorrectQuestionNumber]: incorrectAnswer,
                    ...correctAnswers
                } = parsedAnswers;

                history = {
                    attempt: counter - 1,
                    correctAnswers: correctAnswers,
                    forbiddenAnswers: {
                        [incorrectQuestionNumber]: forbiddenAnswers,
                    },
                    hint: reportResponse.hint,
                };

                console.log(history);

                answerQuestionsResponse =
                    await this.openAiService.answerQuestions(
                        questionData,
                        pdfContent,
                        history
                    );
                console.log(
                    `Answers:\n${JSON.stringify(answerQuestionsResponse)}\n`
                );

                parsedAnswers = answerQuestionsResponse.answer as Answers;
                reportResponse = (await this.reportService.reportAnswer(
                    "notes",
                    parsedAnswers
                )) as ReportQuestionResponse;
            }
        }

        console.log(reportResponse);

        this.rl.close();
    }

    private async confirmAction(query: string) {
        return new Promise<string>((resolve) => {
            this.rl.question(query, (answer) => {
                return resolve(answer);
            });
        });
    }
}
