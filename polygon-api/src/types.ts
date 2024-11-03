export type SendAnswerRequest = {
    task: string;
    apikey: string;
    answer: string | string[];
}

export type SendAnswerResponse = {
    code: number;
    message: string;
}