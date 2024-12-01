import decompress from 'decompress'
import { ClassifiedReportFile, FileType, ReportFile, ReportSortedDataRequest, SortedData } from './types'
import { OpenAiService } from './OpenAiService'

export class ReportService {
    private downloadDataUrl: string
    private reportDataUrl: string
    private userApiKey: string
    private decompress: (
        input: string | Buffer, 
        output?: string | decompress.DecompressOptions, 
        opts?: decompress.DecompressOptions
    ) => Promise<decompress.File[]>
    private openAiService: OpenAiService

    constructor(
        downloadDataUrl: string, 
        reportDataUrl: string, 
        userApiKey: string, 
        decompress: any,
        openAiService: OpenAiService
    ) {
        this.downloadDataUrl = downloadDataUrl
        this.reportDataUrl = reportDataUrl
        this.userApiKey = userApiKey
        this.decompress = decompress
        this.openAiService = openAiService
    }

    async downloadAndUnzip() {
        const response = await fetch(this.downloadDataUrl)
        const responseBuffer = await response.arrayBuffer()
        const data = await this.decompress(Buffer.from(responseBuffer))
        return data
    }

    async classifyReports(files: decompress.File[]) {
        const allowedFileTypesPattern = /(\.txt|\.png|\.mp3)$/
        const reportFilesWithTypes = files
            .filter(file => file.path.includes('report') && allowedFileTypesPattern.test(file.path))
            .map(file => ({
                type: this.getFileType(file),
                file: file
            } as ReportFile))

        const classifiedData: ClassifiedReportFile[] = await Promise.all(reportFilesWithTypes.map(async reportFile => {
            const classifiedData = await this.openAiService.classifyData(reportFile.file, reportFile.type)
        
            if (classifiedData) {
                console.log(`Classified data: ${classifiedData?.category}, file: ${reportFile.file.path}`)
                console.log(`Reasoning: ${classifiedData?.thinking}\n`)    

                return {
                    category: classifiedData.category,
                    fileName: reportFile.file.path
                }
            } else {
                throw Error(`Failed to classify data, file ${reportFile.file.path}`)
            }
        }))

        const sortedData: SortedData = {
            people: [],
            hardware: []
        }

        classifiedData.forEach(classifiedFile => {
            if (classifiedFile.category === 'PEOPLE') {
                sortedData.people.push(classifiedFile.fileName)
            } else if (classifiedFile.category === 'HARDWARE') {
                sortedData.hardware.push(classifiedFile.fileName)
            }
        })

        return sortedData
    }

    async reportSortedData(sortedData: SortedData) {
        const response = await fetch(this.reportDataUrl, {
            method: "POST",
            body: JSON.stringify({
                task: "kategorie",
                apikey: this.userApiKey,
                answer: sortedData
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        return response.json()
    }

    private getFileType(file: decompress.File) {
        let fileType: FileType | undefined
    
        if (file.path.endsWith('.txt')) {
            fileType = 'text'
        } else if (file.path.endsWith('.png')) {
            fileType = 'image'
        } else if (file.path.endsWith('.mp3')) {
            fileType = 'audio'
        } else {
            fileType = undefined
        }
    
        return fileType
    }
}