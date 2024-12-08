import OpenAI from "openai";
import fs from "fs";
import unzipper from "unzipper";
import { globalConfig } from "../common/globalConfig";
import { WeaponTestEmbedding } from "./types";

export class OpenAiService {
    private openAiClient: OpenAI;
    private embeddingsDirectory = "./S03E02/cache";
    private embeddingsFilePath = `${this.embeddingsDirectory}/embeddings.json`;
    private questionEmbeddingFilePath = `${this.embeddingsDirectory}/question-embedding.json`;

    constructor(openAiClient: OpenAI) {
        this.openAiClient = openAiClient;
    }

    async getEmbeddings(files: unzipper.File[]) {
        const cachedEmbeddings = this.openEmbeddingsFile<WeaponTestEmbedding[]>(
            this.embeddingsFilePath
        );

        if (cachedEmbeddings) {
            console.log("Using cached embeddings");
            return cachedEmbeddings;
        } else {
            const embeddings = await Promise.all(
                files.map(async (file) => {
                    const fileText = (
                        await file.buffer(globalConfig.ARCHIVE_PASSWORD)
                    ).toString("utf8");
                    const embedding = await this.getSingleEmbedding(fileText);

                    return {
                        filename: file.path,
                        embedding: embedding,
                    } as WeaponTestEmbedding;
                })
            );

            fs.mkdirSync(this.embeddingsDirectory, { recursive: true });
            fs.writeFileSync(
                this.embeddingsFilePath,
                JSON.stringify(embeddings),
                { encoding: "utf8" }
            );

            return embeddings;
        }
    }

    async getCachedEmbedding(input: string) {
        const cachedEmbedding = this.openEmbeddingsFile<number[]>(
            this.questionEmbeddingFilePath
        );

        if (cachedEmbedding) {
            console.log("Using cached question embedding");
            return cachedEmbedding;
        } else {
            const embedding = await this.getSingleEmbedding(input);

            fs.mkdirSync(this.embeddingsDirectory, { recursive: true });
            fs.writeFileSync(
                this.questionEmbeddingFilePath,
                JSON.stringify(embedding),
                { encoding: "utf8" }
            );

            return embedding;
        }
    }

    async getSingleEmbedding(input: string) {
        const response = await this.openAiClient.embeddings.create({
            input: input,
            model: "text-embedding-3-small",
            encoding_format: "float",
        });

        return response.data[0].embedding;
    }

    async getKeywords() {}

    private openEmbeddingsFile<T>(path: string) {
        try {
            const data = fs.readFileSync(path, "utf8");
            return JSON.parse(data) as T;
        } catch (error) {
            return undefined;
        }
    }
}
