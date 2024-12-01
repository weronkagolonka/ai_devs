import { globalConfig } from "../globalConfig";
import fs from "fs";
import OpenAI from "openai";
import { OpenAIService } from "./OpenAIService";
import { RecordingService } from "./RecordingService";
import { ZipService } from "./ZipService";
import decompress from "decompress";
import { constants } from "./constants";

const main = async () => {
    const openAI = new OpenAI({
        apiKey: globalConfig.OPEN_API_KEY,
    });

    const zipService = new ZipService(decompress);
    const recordingService = new RecordingService(
        globalConfig.DOWNLOAD_RECORDING_URL,
        globalConfig.REPORT_ANSWER_URL,
        globalConfig.USER_API_KEY
    );
    const openAiService = new OpenAIService(openAI);

    const zipArchive = await recordingService.getRecordings();
    const recordings = await zipService.unzipRecordings(
        Buffer.from(zipArchive)
    );
    const adresses = await recordingService.transcribeAndGetAddress(
        recordings,
        openAiService
    );

    adresses.forEach(async (addressResponse) => {
        if (addressResponse) {
            if (
                addressResponse.address === constants.UNKNOWN_ADDRESS_RESPONSE
            ) {
                console.log(
                    `Address was not provided in the recording: ${addressResponse.thinking}`
                );
            } else {
                console.log(
                    `Address found: ${addressResponse.address}, reasoning: ${addressResponse.thinking}`
                );
                const reportResponse = await recordingService.reportData(
                    addressResponse.address
                );
                console.log(Promise.resolve(reportResponse));
            }
        } else {
            console.error("Failed to get address information");
        }
    });
};

main();
