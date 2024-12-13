import fs from "fs";
import { ZipService } from "../common/ZipService";
import { constants } from "./constants";
import { FineTuningService } from "./FineTuningService";
import unzipper from "unzipper";

const main = async () => {
    const zipService = new ZipService();
    const finetuningService = new FineTuningService();
    const jsonlDirectory = "./S04E02/jsonl";

    const labDataResponse = await fetch(
        "https://centrala.ag3nts.org/dane/lab_data.zip"
    );
    const labDataZip = await labDataResponse.arrayBuffer();
    const files = await zipService.extractZip(Buffer.from(labDataZip));

    const correctData = await zipService.getDataFromFile(
        files.find((f) => f.path === constants.CORRECT_FILE_NAME)!!
    );
    const incorrectData = await zipService.getDataFromFile(
        files.find((f) => f.path === constants.INCORRECT_FILE_NAME)!!
    );

    const correctFilesJson = finetuningService.prepareJson(
        correctData.split("\n"),
        constants.CLASSIFY_DATA_SYSTEM_MESSAGE,
        constants.CORRECT
    );
    const incorrectFilesJson = finetuningService.prepareJson(
        incorrectData.split("\n"),
        constants.CLASSIFY_DATA_SYSTEM_MESSAGE,
        constants.INCORRECT
    );

    fs.mkdirSync(jsonlDirectory, { recursive: true });
    fs.writeFileSync(
        `${jsonlDirectory}/dataset.jsonl`,
        [...correctFilesJson, ...incorrectFilesJson]
            .map((f) => JSON.stringify(f))
            .join("\n")
    );
};

main();
