import OpenAI from "openai";
import { globalConfig } from "../globalConfig";
import { PhotoService } from "./PhotoService";
import { OpenAIService } from "./OpenAiService";
import { LocalJsonCache } from "../LocalJsonCache";
import { constants } from "./constants";
import { PhotoLinks, PhotoQualityClassification } from "./types";
import { ReportAnswerRequest } from "../globalTypes";
import { re } from "mathjs";
import { ReportService } from "../ReportService";

const main = async () => {
    const openAI = new OpenAI({
        apiKey: globalConfig.OPEN_API_KEY,
    });
    const localCache = new LocalJsonCache("./S04E01/cache");

    const openAiService = new OpenAIService(openAI);
    const photosService = new PhotoService(
        globalConfig.REPORT_ANSWER_URL,
        globalConfig.USER_API_KEY,
        openAiService,
        localCache
    );
    const reportService = new ReportService();

    const photos = await photosService.getPhotos();
    const allPhotoLinks = await photosService.getPhotoLinksFromBot(
        photos.message,
        constants.GET_ALL_PHOTOS_CACHE_FILE
    );

    const photosOfGoodQuality: string[] = [];
    const generatedLinks: string[] = allPhotoLinks.photoLinks;

    let photosToClassify = allPhotoLinks;
    let count = 0;
    do {
        // classify photos
        const photoQualityClassification =
            await photosService.classifyPhotosQuality(
                photosToClassify,
                `photo_quality_classification_${count}.json`
            );

        // collect photos of good quality and photos that need modification
        const photosToModify: PhotoQualityClassification[] = [];
        photoQualityClassification.forEach((photoClassification) => {
            if (photoClassification.operation === "NONE") {
                photosOfGoodQuality.push(photoClassification.photoLink);
            } else {
                photosToModify.push(photoClassification);
                console.log(photoClassification);
            }
        });
        console.log("Photos of good quality", photosOfGoodQuality);

        const modifiedPhotoDescriptions = await Promise.all(
            photosToModify.map(async (photoCllassification) => {
                const link = photoCllassification.photoLink;
                const fileName = link.substring(link.lastIndexOf("/") + 1);
                const modificationResponse = await photosService.modifyPhoto(
                    fileName,
                    photoCllassification.operation
                );
                return modificationResponse.message;
            })
        );

        // get links of modified photos, use previous links as context if base URL is not provided
        const modifiedPhotoLinks = await photosService.getPhotoLinksFromBot(
            modifiedPhotoDescriptions.join("\n"),
            `modified_photo_links_${count}.json`,
            generatedLinks.join(", ")
        );

        // prepare photos for the next iteration
        photosToClassify = {
            photoLinks: modifiedPhotoLinks.photoLinks,
        } as PhotoLinks;
        count++;
    } while (
        photosOfGoodQuality.length !== allPhotoLinks.photoLinks.length &&
        photosToClassify.photoLinks.length > 0
    );

    // try getting descriptions of barbara
    const barbaraDescription = await photosService.getBarbaraDescription(
        photosOfGoodQuality
    );

    const reportResponse = await reportService.reportAnswer(
        "photos",
        barbaraDescription
    );
    console.log(reportResponse);
};

main();
