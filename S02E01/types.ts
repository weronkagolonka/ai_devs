export type ReportRecordingDataRequest = {
    task: string
    apikey: string
    answer: string | any[] | object
}

export type FindAddressResponse = {
    thinking: string,
    address: string
}