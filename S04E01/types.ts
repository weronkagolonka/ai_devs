export type PhotoOperation = "REPAIR" | "BRIGHTEN" | "DARKEN";

export type PhotoQualityClassification = {
    photoLink: string;
    operation: PhotoOperation;
};

export type PhotoContentClassification = {
    photoLink: string;
    isWoman: boolean;
};

export type OpenAIResponse = {
    _thinking: string;
    answer: string | string[];
};
