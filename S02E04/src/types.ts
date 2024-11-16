import decompress from "decompress"

export type ReportSortedDataRequest = {
    task: string,
    apikey: string,
    answer: string | any[] | object
}

export type SortedData = {
    people: string[],
    hardware: string[],
}

export type ReportFile = {
    type: FileType
    file: decompress.File
}

export type ClassifiedReportFile = {
    category: FileCategories
    fileName: string
}

export type ClassifyFileResponse = {
    thinking: string
    category: FileCategories
}

export type FileType = 'text' | 'audio' | 'image'

export type FileCategories = 'PEOPLE' | 'HARDWARE' | 'OTHER'