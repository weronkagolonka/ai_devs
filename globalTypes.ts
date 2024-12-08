export type ReportAnswerRequest = {
    task: string;
    apikey: string;
    answer: string | any[] | object;
};

export type ReportAnswerResponse = {
    code: number;
    message: string;
};
