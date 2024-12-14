import OpenAI from "openai";

export type Question = {
    id: string;
    question: string;
};

export type Answer = {
    id: string;
    type: "ANSWER" | "REDIRECT";
    content: string;
};

export type OpenAiAnswer = {
    type: "ANSWER" | "REDIRECT";
    content: string;
};

export type OpenAiResponse = {
    _thinking: string;
    answer: OpenAiAnswer;
};
