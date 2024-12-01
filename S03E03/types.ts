export type ReportAnswerRequest = {
    task: string;
    apikey: string;
    answer: string | any[] | object;
};

export type DatabaseRequest = {
    task: string;
    apikey: string;
    query: string;
};

export type QueryResponse = {
    reply: { [key: string]: string }[];
    error: string;
};

export type ShowTableStructureResponse = {
    reply: Table[];
    error: string;
};

export type Table = {
    Table: string;
    [key: string]: string;
};
