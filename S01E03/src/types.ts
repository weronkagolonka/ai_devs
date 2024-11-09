export type ReportCalibratedFileRequest = {
    task: string
    apikey: string
    answer: string | any[] | object
}

export type IndexedTest = {
    test: Test,
    index: number
}

export type Test = {
    q: string,
    a: string
}

export type TestData = {
    question: string,
    answer: number,
    test: Test | undefined
}

export type CalibratedFile = {
    apikey: string,
    description: string,
    copyright: string,
    "test-data": TestData[]
}