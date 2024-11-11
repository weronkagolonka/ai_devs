export type ReportDataRequest = {
    task: string
    apikey: string
    answer: string | any[] | object
}

export type LocalLlamaRequest = {
    model: string
    prompt: string
    stream: boolean
}

export type LocalLLamaResponse = {
    model: string
    "created_at": string
    response: string
    done: boolean
    "done_reason": string
}

export type CompletionResponse = {
    "_thinking": string
    data: string
}