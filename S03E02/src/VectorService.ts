import { QdrantClient } from "@qdrant/qdrant-js";
import { Point } from "./types";
import { match } from "assert";

export class VectorService {
    private qdrantClient: QdrantClient;
    private collectionName: string = "weapon_tests";
    private vectorSize = 1536;

    constructor(qdrantClient: QdrantClient) {
        this.qdrantClient = qdrantClient;
    }

    async createCollection() {
        const collectionExists = await this.qdrantClient.collectionExists(
            this.collectionName
        );

        if (collectionExists) {
            console.log("Recreating collection");
            this.qdrantClient.deleteCollection(this.collectionName);
        }

        await this.qdrantClient.createCollection(this.collectionName, {
            vectors: { size: this.vectorSize, distance: "Cosine" },
        });
    }

    async insertPoints(pointsToInsert: Point[]) {
        const response = await this.qdrantClient.upsert(this.collectionName, {
            points: pointsToInsert,
        });

        return response;
    }

    async queryVectors(vector: number[], limit: number = 1) {
        const response = await this.qdrantClient.query(this.collectionName, {
            query: vector,
            // filter: {
            //     must: [
            //         {
            //             key: "date",
            //             match: {
            //                 value: fileDate,
            //             },
            //         },
            //     ],
            // },
            limit: limit,
            with_payload: true,
        });

        return response;
    }
}
