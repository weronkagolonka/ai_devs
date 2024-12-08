import OpenAI from "openai";
import { globalConfig } from "../common/globalConfig";
import { OpenAiService } from "./OpenAiService";
import { FileService } from "./FileService";

const main = async () => {
    const openAi = new OpenAI({
        apiKey: globalConfig.OPEN_API_KEY,
    });
    const openAiService = new OpenAiService(openAi);
    const fileService = new FileService(
        globalConfig.DOWNLOAD_ZIP_URL,
        globalConfig.USER_API_KEY,
        globalConfig.REPORT_ANSWER_URL,
        openAiService
    );

    const files = await fileService.getFiles();
    const factsAsMarkdown = fileService.convertFactsToMarkdown(files);
    const reports = fileService.collectReports(files);
    const metadata = await fileService.generateMetadadata(
        factsAsMarkdown,
        reports
    );
    const metadataReport = {};
    metadata.forEach((m) => {
        metadataReport[m.filename] = m.metadata;
    });
    const reportResponse = await fileService.reportMetadata(metadataReport);
    console.log(reportResponse);
};

main();
