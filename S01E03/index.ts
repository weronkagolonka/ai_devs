import OpenAI from "openai";
import { OpenAiService } from "./OpenAiService";
import { globalConfig } from "../common/globalConfig";
import { CalibrationService } from "./CalibrationService";

const main = async () => {
    const openAiService = new OpenAiService(
        new OpenAI({ apiKey: globalConfig.OPEN_API_KEY })
    );
    const calibrationService = new CalibrationService(
        globalConfig.REPORT_ANSWER_URL,
        globalConfig.USER_API_KEY,
        openAiService
    );

    const fileContent = await calibrationService.downloadFile();
    const calibratedFile = await calibrationService.calibrateFile(fileContent);

    if (calibratedFile) {
        const reportResponse = await calibrationService.reportCalibratedFile(
            calibratedFile
        );
        console.log(reportResponse);
    } else {
        console.error("Calibration failed");
    }
};

main();
