import OpenAI from "openai";
import { PdfService } from "./PdfService";
import { globalConfig } from "../common/globalConfig";
import { OpenAiService } from "./OpenAiService";
import { LocalJsonCache } from "../common/LocalJsonCache";
import { ReportService } from "../common/ReportService";
import { Answers, Questions } from "./types";
import { UserInterface } from "./UserInterface";

const main = async () => {
    const openAiClient = new OpenAI({
        apiKey: globalConfig.OPEN_API_KEY,
    });
    const openAiService = new OpenAiService(openAiClient);
    const localCache = new LocalJsonCache("./S04E05/cache");
    const reportService = new ReportService();

    const pdfFileUrl = "https://centrala.ag3nts.org/dane/notatnik-rafala.pdf";
    const pdfService = new PdfService(pdfFileUrl, openAiService, localCache);

    const userInterface = new UserInterface(reportService, openAiService);

    const content = await pdfService.pdfToMarkdown();
    if (!content) {
        console.error("Failed to parse PDF content");
        return;
    } else {
        userInterface.exec(content);
    }
};

main();
