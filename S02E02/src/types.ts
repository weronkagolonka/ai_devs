export type ReportLocationRequest = {
    task: string
    apikey: string
    answer: string | any[] | object
}

export type FindCityResponse = {
    thinking: string
    city: string
}