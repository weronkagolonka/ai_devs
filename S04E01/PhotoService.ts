import { ReportAnswerRequest } from "../globalTypes";
import { OpenAIService } from "./OpenAiService";
import {
    PhotoQualityClassification,
    PhotoOperation,
    PhotoContentClassification,
} from "./types";

export class PhotoService {
    private getPhotosUrl: string;
    private userApiKey: string;
    private openAiService: OpenAIService;

    constructor(
        getPhotosUrl: string,
        userApiKey: string,
        openAiService: OpenAIService
    ) {
        this.getPhotosUrl = getPhotosUrl;
        this.userApiKey = userApiKey;
        this.openAiService = openAiService;
    }

    async getPhotos() {
        const response = await this.sendRequest({
            task: "photos",
            apikey: this.userApiKey,
            answer: "START",
        });

        return response;
    }

    async modifyPhoto(photoTitle: string, operation: PhotoOperation) {
        const response = await this.sendRequest({
            task: "photos",
            apikey: this.userApiKey,
            answer: `${operation} ${photoTitle}`,
        });

        return response;
    }

    async getPhotoLinksFromBot(botAnswer: string) {
        const handledAnswer = await this.openAiService.getCompletion(
            botAnswer,
            "TODO"
        );
        return handledAnswer.answer as string[];
    }

    async classifyPhotosQuality(photoLinks: string[]) {
        const classifications = await Promise.all(
            photoLinks.map(async (photoLink) => {
                const classification = await this.openAiService.getCompletion(
                    photoLink,
                    "TODO"
                );
                return {
                    photoLink: photoLink,
                    operation: classification.answer as PhotoOperation,
                } as PhotoQualityClassification;
            })
        );

        return classifications;
    }

    async classifyPhotosContent(photoLinks: string[]) {
        const classifications = await Promise.all(
            photoLinks.map(async (photoLink) => {
                const classification = await this.openAiService.getCompletion(
                    photoLink,
                    "TODO"
                );
                return {
                    photoLink: photoLink,
                    isWoman: classification.answer === "true" ? true : false,
                } as PhotoContentClassification;
            })
        );

        return classifications;
    }

    async getBarbaraDescription(photoLinks: string[]) {
        const description = await this.openAiService.getCompletion(
            photoLinks,
            "TODO"
        );

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
