export type ReportAnswerRequest = {
    task: string;
    apikey: string;
    answer: string | any[] | object;
};

export type Point = {
    id: string;
    payload: { [key: string]: unknown };
    vector: number[];
};

export type WeaponTestEmbedding = {
    filename: string;
    embedding: number[];
};
