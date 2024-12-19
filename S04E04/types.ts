export type GetDronLocationRequest = {
    instruction: string;
};

export type ErrorResponse = {
    success: boolean;
    status: number;
    message: string;
};

export type GetDronLocationResponse = {
    description: string;
};

export type OpenAiResponse = {
    _thinking: string;
    answer: GetDronLocationResponse;
};
