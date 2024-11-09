import OpenAI from "openai";
import { OpenAiService } from "./OpenAiService";
import { config } from "./config";
import { CalibrationService } from "./CalibrationService";

const main = async () => {
    const openAiService = new OpenAiService(
        new OpenAI({apiKey: config.OPEN_API_KEY})
    );
    const calibrationService = new CalibrationService(
        config.REPORT_ENDPOINT_URL,
        config.USER_KEY,
        openAiService
    )

    const fileContent = await calibrationService.downloadFile();
    const calibratedFile = await calibrationService.calibrateFile(fileContent);
    
    if (calibratedFile) {
        const reportResponse = await calibrationService.reportCalibratedFile(calibratedFile);
        console.log(reportResponse)
    } else {
        console.error("Calibration failed");
    }
}

main()