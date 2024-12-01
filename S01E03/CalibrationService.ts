import { create, all, Index } from 'mathjs';
import { OpenAiService } from "./OpenAiService";
import { CalibratedFile, IndexedTest, ReportCalibratedFileRequest, Test } from "./types";
import { systemPrompt } from './prompt';

export class CalibrationService {
    private downloadUrl: string;
    private reportUrl: string;
    private userApiKey: string;
    private openAiService: OpenAiService
    private math = create(all);

    constructor(reportUrl: string, userApiKey: string, openAiService: OpenAiService) {     
        this.downloadUrl = `https://centrala.ag3nts.org/data/${userApiKey}/json.txt`;
        this.reportUrl = reportUrl;
        this.userApiKey = userApiKey;
        this.openAiService = openAiService;
    }

    async downloadFile() {
        const response = await fetch(this.downloadUrl);
        return response.json();
    }

    async reportCalibratedFile(calibratedFile: CalibratedFile) {
        const requestBody: ReportCalibratedFileRequest = {
            task: "JSON",
            apikey: this.userApiKey,
            answer: calibratedFile,
        }
        const response = await fetch(this.reportUrl, {
            method: "POST",
            body: JSON.stringify(requestBody)
        });
        return response.json();
    }

    async calibrateFile(file: CalibratedFile) {
        const questions: IndexedTest[] = []
        file['test-data'].forEach((testData, index) => {
            if (testData.test) {
                questions.push({test: testData.test, index});
            }
        })

        const userPrompt = JSON.stringify(questions);
        console.log(`user prompt: ${userPrompt}`);
        
        const completionResponse = await this.openAiService.correctFileContent(systemPrompt, userPrompt);
        console.log(completionResponse)
        
        if (completionResponse !== null) {
            const answersAsJson = JSON.parse(completionResponse) as IndexedTest[];
            const correctedTestData = file["test-data"].map((testData, index) => {
                const calculationResult = this.math.evaluate(testData.question);
                if (calculationResult !== testData.answer) {
                    console.log(`Found wrong calculation at index ${index}, expr ${testData.question}, answer: ${testData.answer}`);
                }

                return {
                    question: testData.question,
                    answer: calculationResult,
                    test: answersAsJson.find((answer) => answer.index === index)?.test
                }
            })

            return {
                ...file,
                apikey: this.userApiKey,
                "test-data": correctedTestData
            } as CalibratedFile
        } else {
            console.error("Failed to get answers")
            return undefined
        }
    }
}