import OpenAI from "openai";
import { config } from "./config";
import { OpenAiService } from "./OpenAiService";
import { FileService } from "./FileService";

const main = async () => {
    const openAi = new OpenAI({
        apiKey: config.OPEN_API_KEY,
    });
    const openAiService = new OpenAiService(openAi);
    const fileService = new FileService(
        config.DOWNLOAD_FILES_ENDPOINT_URL,
        config.USER_API_KEY,
        config.REPORT_FILES_ENDPOINT_URL,
        openAiService
    );

    const files = await fileService.getFiles();
    const factsAsMarkdown = fileService.convertFactsToMarkdown(files);
    const reports = fileService.collectReports(files);
    const metadata = await fileService.generateMetadadata(factsAsMarkdown, reports);
    const metadataReport = {}
    metadata.forEach(m => {
        metadataReport[m.filename] = m.metadata
    })
    const reportResponse = await fileService.reportMetadata(metadataReport);
    console.log(reportResponse);
};

main();
