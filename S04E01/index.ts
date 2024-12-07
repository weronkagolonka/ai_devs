import OpenAI from "openai";
import { globalConfig } from "../globalConfig";
import { PhotoService } from "./PhotoService";
import { OpenAIService } from "./OpenAiService";

const main = async () => {
    const openAI = new OpenAI({
        apiKey: globalConfig.OPEN_API_KEY,
    });
    const openAiService = new OpenAIService(openAI);
    const photosService = new PhotoService(
        globalConfig.REPORT_ANSWER_URL,
        globalConfig.USER_API_KEY,
        openAiService
    );

    const photos = await photosService.getPhotos();
    console.log(photos);
};

main();
