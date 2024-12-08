export type PhotoLinks = {
    photoLinks: string[];
};

export type PhotoOperation = "REPAIR" | "BRIGHTEN" | "DARKEN" | "NONE";

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

export type PhotoBotResponse = {
    code: number;
    message: string;
};
