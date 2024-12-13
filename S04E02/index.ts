import OpenAI from "openai";
import { ZipService } from "../common/ZipService";
import { constants } from "./constants";
import { OpenAiService } from "./OpenAiService";
import { globalConfig } from "../common/globalConfig";
import { LocalJsonCache } from "../common/LocalJsonCache";
import { corr } from "mathjs";
import { ReportService } from "../common/ReportService";

const main = async () => {
    const openaAiClient = new OpenAI({
        apiKey: globalConfig.OPEN_API_KEY,
    });

    const zipService = new ZipService();
    const openAiService = new OpenAiService(openaAiClient);
    const localJsonCache = new LocalJsonCache("./S04E02/cache");
    const reportService = new ReportService();

    const labDataResponse = await fetch(
        "https://centrala.ag3nts.org/dane/lab_data.zip"
    );
    const labDataZip = await labDataResponse.arrayBuffer();
    const files = await zipService.extractZip(Buffer.from(labDataZip));
    const dataToVerify = await zipService.getDataFromFile(
        files.find((f) => f.path === constants.FILES_TO_VERIFY_FILE_NAME)!!
    );

    const labDataPerId: { [key: string]: string } = {};
    dataToVerify
        .trim()
        .split("\n")
        .forEach((line) => {
            const [id, data] = line.split("=");
            labDataPerId[id] = data;
        });

    const cache = localJsonCache.openFile<string[]>("cache.json");
    let correctData: string[] = [];

    if (cache) {
        correctData = cache;
    } else {
        const categorizedData = await Promise.all(
            Object.keys(labDataPerId).map(async (id) => {
                const data = labDataPerId[id];
                const category = await openAiService.fineTunedCompletion(data);
                return { id, category };
            })
        );
        correctData = categorizedData
            .filter((d) => d.category === constants.CORRECT)
            .map((d) => d.id);

        localJsonCache.saveFile("cache.json", correctData);
    }

    const reportResponse = await reportService.reportAnswer(
        "research",
        correctData
    );
    console.log(reportResponse);
};

main();
