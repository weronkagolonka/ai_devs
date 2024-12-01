export type ReportArticleAnswersRequest = {
    task: string,
    apikey: string,
    answer: string | any[] | object
}

export type ArticleAnswers = {
    [key: string]: string
}

export type Question = {
    id: string,
    question: string,
}

export type AnsweredQuestion = {
    question: Question,
    answer: string
}

export type Answer = {
    answer: string,
    thinking: string
}