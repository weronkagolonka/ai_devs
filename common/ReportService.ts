import { globalConfig } from "./common/globalConfig";
import {
    ReportAnswerRequest,
    ReportAnswerResponse,
} from "./common/globalTypes";

export class ReportService {
    async reportAnswer(
        taskName: string,
        answer: string | string[] | object
    ): Promise<ReportAnswerResponse> {
        const reportResponse = await fetch(globalConfig.REPORT_ANSWER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                task: taskName,
                apikey: globalConfig.USER_API_KEY,
                answer: answer,
            } as ReportAnswerRequest),
        });

        return (await reportResponse.json()) as ReportAnswerResponse;
    }
}
