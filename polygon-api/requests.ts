import { config } from "./config";
import { SendAnswerRequest, SendAnswerResponse } from "./types";

export const getSourceStrings = async () => {
    const response = await fetch(config.DATA_SOURCE_ENDPOINT);
    return (await response.text()).trim().split("\n");
};

export const sendTaskAnswer = async (answer: string[]) => {
    const requestBody: SendAnswerRequest = {
        task: config.TASK_NAME,
        apikey: config.API_KEY,
        answer: answer,
    };
    const response = await fetch(config.TARGET_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(requestBody),
    });
    return response.json() as Promise<SendAnswerResponse>;
};
