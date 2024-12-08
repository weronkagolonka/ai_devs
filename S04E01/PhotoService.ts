import { ReportAnswerRequest } from "../globalTypes";
import { LocalJsonCache } from "../LocalJsonCache";
import { OpenAIService } from "./OpenAiService";
import { classifyPhotoQualityPrompt } from "./prompts/classifyPhotoQualityPrompt";
import { describeBarbaraPrompt } from "./prompts/describeBarbaraPrompt";
import { getPhotoLinksPrompt } from "./prompts/getPhotoLinksPrompt";
import {
    PhotoQualityClassification,
    PhotoOperation,
    PhotoContentClassification,
    PhotoLinks,
    PhotoBotResponse,
} from "./types";

export class PhotoService {
    private getPhotosUrl: string;
    private userApiKey: string;
    private openAiService: OpenAIService;
    private localCache: LocalJsonCache;

    constructor(
        getPhotosUrl: string,
        userApiKey: string,
        openAiService: OpenAIService,
        localCache: LocalJsonCache
    ) {
        this.getPhotosUrl = getPhotosUrl;
        this.userApiKey = userApiKey;
        this.openAiService = openAiService;
        this.localCache = localCache;
    }

    async getPhotos(): Promise<PhotoBotResponse> {
        const response = await this.sendRequest({
            task: "photos",
            apikey: this.userApiKey,
            answer: "START",
        });

        return response as PhotoBotResponse;
    }

    async modifyPhoto(
        photoTitle: string,
        operation: PhotoOperation
    ): Promise<PhotoBotResponse> {
        const response = await this.sendRequest({
            task: "photos",
            apikey: this.userApiKey,
            answer: `${operation} ${photoTitle}`,
        });

        return response as PhotoBotResponse;
    }

    async getPhotoLinksFromBot(
        botAnswer: string,
        cacheFileName: string,
        previousLinks: string | undefined = undefined
    ): Promise<PhotoLinks> {
        const cacheFile = this.localCache.openFile<PhotoLinks>(cacheFileName);

        if (cacheFile) {
            console.log("Photo links from cache");
            return cacheFile;
        } else {
            const handledAnswer = await this.openAiService.getCompletion(
                [botAnswer],
                false,
                getPhotoLinksPrompt(previousLinks)
            );
            const links = {
                photoLinks: handledAnswer.answer as string[],
            } as PhotoLinks;

            this.localCache.saveFile<PhotoLinks>(cacheFileName, links);

            return links;
        }
    }

    /**
     * Uses photos with lower size (50%)
     */
    async classifyPhotosQuality(links: PhotoLinks, cacheFileName: string) {
        const cacheFile =
            this.localCache.openFile<PhotoQualityClassification[]>(
                cacheFileName
            );

        if (cacheFile) {
            console.log("Photo quality classifications from cache");
            return cacheFile;
        } else {
            const classifications = await Promise.all(
                links.photoLinks.map(async (photoLink) => {
                    const linkSegments = photoLink.split("/");
                    const fileNameIndex = linkSegments.length - 1;
                    const file = linkSegments.splice(fileNameIndex, 1)[0];

                    const [fileName, extension] = file.split(".");
                    const smallFileName = `${fileName}-small.${extension}`;
                    const smallPhotoLink = [
                        ...linkSegments,
                        smallFileName,
                    ].join("/");

                    const classification =
                        await this.openAiService.getCompletion(
                            [smallPhotoLink],
                            true,
                            classifyPhotoQualityPrompt
                        );

                    return {
                        photoLink: photoLink,
                        operation: classification.answer as PhotoOperation,
                    } as PhotoQualityClassification;
                })
            );

            this.localCache.saveFile<PhotoQualityClassification[]>(
                cacheFileName,
                classifications
            );

            return classifications;
        }
    }

    async getBarbaraDescription(photoLinks: string[]) {
        const description = await this.openAiService.getCompletion(
            photoLinks,
            true,
            describeBarbaraPrompt
        );
        console.log(description);

        return description.answer as string;
    }

    private async sendRequest(body: ReportAnswerRequest) {
        const response = await fetch(this.getPhotosUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        return await response.json();
    }
}
