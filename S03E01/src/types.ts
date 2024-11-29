export type ReportMetadataRequest = {
    task: string;
    apikey: string;
    answer: string | any[] | object;
};

export type Report = {
    filename: string;
    content: string;
};

export type Metadata = {
    [filename: string]: string;
};

export type WeaponTestEmbedding = {
    filename: string;
    embedding: number[];
};
