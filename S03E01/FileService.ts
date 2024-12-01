import decompress from "decompress";
import fs from "fs";
import { OpenAiService } from "./OpenAiService";
import { Metadata, Report, ReportMetadataRequest } from "./types";

export class FileService {
    private downloadFilesEndpointUrl: string;
    private userApiKey: string;
    private reportEndpointUrl: string;
    private openAiService: OpenAiService;
    private metadataDirectory: string = "./S03E01/metadata";
    private metadataFilePath: string = `${this.metadataDirectory}/metadata.json`;

    constructor(
        downloadFilesEndpointUrl: string,
        userApiKey: string,
        reportEndpointUrl: string,
        openAiService: OpenAiService
    ) {
        this.downloadFilesEndpointUrl = downloadFilesEndpointUrl;
        this.userApiKey = userApiKey;
        this.reportEndpointUrl = reportEndpointUrl;
        this.openAiService = openAiService;
    }

    async getFiles() {
        const response = await fetch(this.downloadFilesEndpointUrl);
        const buffer = await response.arrayBuffer();
        const data = await decompress(Buffer.from(buffer));
        return data;
    }

    convertFactsToMarkdown(files: decompress.File[]) {
        let markdown = "# Facts\n\n";

        files
            .filter(
                (file) =>
                    file.path.includes("facts") && file.type !== "directory"
            )
            .forEach((file) => {
                const contents = file.data.toString("utf8");
                if (!contents.includes("entry deleted")) {
                    markdown += `## ${file.path}\n\n${contents}\n\n`;
                }
            });

        return markdown;
    }

    collectReports(files: decompress.File[]) {
        return files
            .filter(
                (file) =>
                    file.path.includes("report") && file.path.endsWith(".txt")
            )
            .map(
                (file) =>
                    ({
                        filename: file.path,
                        content: file.data.toString("utf8"),
                    } as Report)
            );
    }

    async generateMetadadata(facts: string, reports: Report[]) {
        const metadataFromFile = this.openMetadataFile();

        if (metadataFromFile) {
            console.log("use cached metadata");
            for (const report of reports) {
                const metadata = metadataFromFile.find(
                    (metadata) => metadata.filename === report.filename
                );

                if (!metadata) {
                    console.log("cache miss");
                    const newMetadata =
                        await this.openAiService.getFileMetadata(
                            `## ${report.filename}\n\n${report.content}`,
                            facts
                        );
                    metadataFromFile.push({
                        filename: report.filename,
                        metadata: newMetadata,
                    });
                }
            }

            fs.truncateSync(this.metadataFilePath);
            fs.writeFileSync(
                this.metadataFilePath,
                JSON.stringify(metadataFromFile),
                {
                    encoding: "utf-8",
                }
            );

            return metadataFromFile;
        } else {
            const metadata = await Promise.all(
                reports.map(async (report) => {
                    const metadata = await this.openAiService.getFileMetadata(
                        `## ${report.filename}\n\n${report.content}`,
                        facts
                    );

                    return {
                        filename: report.filename,
                        metadata,
                    };
                })
            );

            fs.mkdirSync(this.metadataDirectory, { recursive: true });
            fs.writeFileSync(this.metadataFilePath, JSON.stringify(metadata), {
                encoding: "utf-8",
            });

            return metadata;
        }
    }

    async reportMetadata(metadata: Metadata) {
        const response = await fetch(this.reportEndpointUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                task: "dokumenty",
                apikey: this.userApiKey,
                answer: metadata,
            } as ReportMetadataRequest),
        });

        return response.json();
    }

    private openMetadataFile() {
        try {
            const metadataFile = fs.readFileSync(
                this.metadataFilePath,
                "utf-8"
            );
            return JSON.parse(metadataFile) as Metadata[];
        } catch (error) {
            return undefined;
        }
    }
}
