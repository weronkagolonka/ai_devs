import unzipper from "unzipper";
import { ReportAnswerRequest } from "./types";
import { config } from "./config";

export class ReportService {
    private downloadFilesEndpointUrl: string;
    private reportAnswerEndpointUrl: string;
    private userApiKey: string;
    private weaponsTestsArchiveName = "weapons_tests.zip";

    constructor(
        downloadFilesEndpointUrl: string,
        reportAnswerEndpointUrl: string,
        userApiKey: string
    ) {
        this.downloadFilesEndpointUrl = downloadFilesEndpointUrl;
        this.reportAnswerEndpointUrl = reportAnswerEndpointUrl;
        this.userApiKey = userApiKey;
    }

    async downloadAndExtractFiles() {
        const response = await fetch(this.downloadFilesEndpointUrl);
        const buffer = await response.arrayBuffer();

        const directory = await unzipper.Open.buffer(Buffer.from(buffer));
        const weaponsArchive = await directory.files
            .find((f) => f.path.includes(this.weaponsTestsArchiveName))
            ?.buffer(config.ARCHIVE_PASSWORD);

        if (!weaponsArchive) {
            throw new Error("Weapons archive not found");
        } else {
            const weaponsDirectory = await unzipper.Open.buffer(weaponsArchive);
            return weaponsDirectory.files.map(
                (f) =>
                    ({
                        ...f,
                        path: f.path.split("/")[1].replaceAll("_", "-"),
                    } as unzipper.File)
            );
        }
    }

    async reportAnswer(date: string) {
        const response = await fetch(this.reportAnswerEndpointUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                task: "wektory",
                apikey: this.userApiKey,
                answer: date,
            } as ReportAnswerRequest),
        });

        return response.json();
    }
}
