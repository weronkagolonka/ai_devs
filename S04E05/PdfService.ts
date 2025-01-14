import { OpenAiResponse, MarkdownContent, PdfDocumentContent } from "./types";
import { OpenAiService } from "./OpenAiService";
import { LocalJsonCache } from "../common/LocalJsonCache";
import {
    getDocument,
    OPS,
    PDFDocumentProxy,
    PDFPageProxy,
} from "pdfjs-dist/legacy/build/pdf.mjs";
import { TextItem } from "pdfjs-dist/types/src/display/api";
import fs from "fs";
import sharp from "sharp";
import {
    describeImageSystemPrompt,
    describePageImagesSystemPrompt,
} from "./prompts/describeImage";

export class PdfService {
    private fileUrl: string;
    private openAiService: OpenAiService;
    private cache: LocalJsonCache;
    private parsedPdfFileName = "parsedPdf.json";
    private imageOperators = [
        OPS.paintImageXObject,
        OPS.paintInlineImageXObject,
        OPS.paintImageMaskXObject,
    ];

    constructor(
        fileUrl: string,
        openAiService: OpenAiService,
        cache: LocalJsonCache
    ) {
        this.fileUrl = fileUrl;
        this.openAiService = openAiService;
        this.cache = cache;
    }

    async pdfToMarkdown(): Promise<PdfDocumentContent | undefined> {
        try {
            const cacheFile = this.cache.openFile<PdfDocumentContent>(
                this.parsedPdfFileName
            );
            const pdfContent = cacheFile ?? ({} as PdfDocumentContent);

            const document = getDocument(this.fileUrl);
            const pdfData = await document.promise;
            const pageCount = pdfData.numPages;

            for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
                if (!pdfContent[pageNum]) {
                    let pageMarkdownContent = "";

                    const page = await pdfData.getPage(pageNum);
                    // Allow page to fully load
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    console.log(`Processing page ${page.pageNumber}...`);

                    pageMarkdownContent += `## Page ${pageNum}\n\n`;

                    const imageBuffer = await this.renderPageToBuffer(
                        pdfData,
                        page
                    );
                    if (imageBuffer !== null) {
                        const compressed = await sharp(imageBuffer)
                            .png({
                                quality: 100,
                                compressionLevel: 9,
                            })
                            .toBuffer();

                        const lastPage = pageNum === pageCount;
                        const documentContent = JSON.stringify(pdfContent);
                        const systemPrompt = lastPage
                            ? describeImageSystemPrompt(documentContent)
                            : describePageImagesSystemPrompt;

                        const imageDescription =
                            await this.openAiService.getImageDescription(
                                compressed,
                                systemPrompt,
                                lastPage ? "gpt-4o" : undefined
                            );
                        console.log(imageDescription);

                        if (lastPage) {
                            pageMarkdownContent += `${imageDescription.answer}\n\n`;
                        } else {
                            const textContent = await page.getTextContent();

                            pageMarkdownContent += `${textContent.items
                                .map((item) => (item as TextItem).str)
                                .join("\n")}\n\n`;

                            // add image descriptions
                            pageMarkdownContent += `### Page images\n\n${(
                                imageDescription.answer as string[]
                            ).join("\n")}\n\n`;
                        }
                    }

                    pdfContent[pageNum] = {
                        page: pageMarkdownContent,
                    };

                    page.cleanup();
                } else {
                    console.log(`Using cached content for page ${pageNum}`);
                }
            }

            if (!cacheFile) {
                console.log("Save new cache file");
                this.cache.saveFile(this.parsedPdfFileName, pdfContent);
            } else {
                console.log("Update existing cache file");
                this.cache.updateExistingFile(
                    this.parsedPdfFileName,
                    pdfContent
                );
            }

            return pdfContent;
        } catch (error) {
            console.error(`Failed to parse PDF`, error);
            return undefined;
        }
    }

    private async renderPageToBuffer(
        document: PDFDocumentProxy,
        page: PDFPageProxy
    ): Promise<Buffer | null> {
        try {
            const canvasFactory = document.canvasFactory;
            const viewport = page.getViewport({ scale: 1.0 });

            // Create canvas matching image dimensions
            const canvasAndCtx = canvasFactory.create(
                viewport.width,
                viewport.height
            );

            // Draw image data to canvas
            const renderCtx = {
                canvasContext: canvasAndCtx.context,
                viewport: viewport,
                canvasFactory: canvasFactory,
            };

            // Get buffer and cleanup
            const renderTask = page.render(renderCtx);
            await renderTask.promise;

            const canvas = canvasAndCtx.canvas;
            const buffer = canvas.toBuffer("image/png");

            return buffer;
        } catch (error) {
            console.error(`Failed to render image`, error);
            return null;
        }
    }
}
