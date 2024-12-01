import { globalConfig } from "../globalConfig";
import decompress from "decompress";
import OpenAI from "openai";
import { OpenAiService } from "./OpenAiService";
import { ReportService } from "./ReportService";

const main = async () => {
    const openAI = new OpenAI({
        apiKey: globalConfig.OPEN_API_KEY,
    });

    const openAiService = new OpenAiService(openAI);
    const reportService = new ReportService(
        globalConfig.DOWNLOAD_ZIP_URL,
        globalConfig.REPORT_ANSWER_URL,
        globalConfig.USER_API_KEY,
        decompress,
        openAiService
    );

    const unzippedData = await reportService.downloadAndUnzip();
    const sortedData = await reportService.classifyReports(unzippedData);
    console.log(sortedData);

    const reportResponse = await reportService.reportSortedData(sortedData);
    console.log(reportResponse);
};

main();
