import { config } from './config'
import decompress from 'decompress'
import OpenAI from 'openai'
import { OpenAiService } from './OpenAiService'
import { ReportService } from './ReportService'
import { ClassifiedReportFile, FileCategories, FileType, ReportFile, SortedData } from './types'

const main = async () => {
    const openAI = new OpenAI({
        apiKey: config.OPEN_API_KEY
    })
    
    const openAiService = new OpenAiService(openAI)
    const reportService = new ReportService(
        config.DOWNLOAD_DATA_URL,
        config.REPORT_DATA_URL,
        config.USER_API_KEY,
        decompress,
        openAiService
    )

    const unzippedData = await reportService.downloadAndUnzip()
    const sortedData = await reportService.classifyReports(unzippedData)
    console.log(sortedData)

    const reportResponse = await reportService.reportSortedData(sortedData)
    console.log(reportResponse)
}

main()