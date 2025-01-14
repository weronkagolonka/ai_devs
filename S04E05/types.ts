export type PdfDocumentContent = {
    [pageNumber: string]: {
        page: string;
    };
};

export type InvalidImage = "INVALID";

export type OpenAiResponse = {
    _thinking: string;
    answer: string | string[] | object;
};

export type MarkdownContent = {
    content: string;
};

export type Questions = {
    [id: string]: string;
};

export type Answers = {
    [id: string]: string;
};

export type ReportQuestionResponse = {
    code: number;
    message: string;
    hint: string;
    debug: string;
};

export type ForbiddenAnswers = {
    [id: string]: string[];
};

export type AnswerHistory = {
    attempt: number;
    forbiddenAnswers: ForbiddenAnswers;
    correctAnswers: Answers;
    hint: string;
};
