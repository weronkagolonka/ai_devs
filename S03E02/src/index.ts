import OpenAI from "openai";
import { config } from "./config";
import { ReportService } from "./ReportService";
import { OpenAiService } from "./OpenAiService";
import { VectorService } from "./VectorService";
import { QdrantClient } from "@qdrant/qdrant-js";
import { randomUUID } from "crypto";

const QUESTION =
    "W raporcie, z którego dnia znajduje się wzmianka o kradzieży prototypu broni?";

const main = async () => {
    const openAI = new OpenAI({
        apiKey: config.OPEN_API_KEY,
    });
    const qdrantClient = new QdrantClient({
        host: "localhost",
        port: config.QDRANT_PORT,
    });

    const openAiService = new OpenAiService(openAI);
    const reportService = new ReportService(
        config.DOWNLOAD_FILES_ENDPOINT_URL,
        config.REPORT_ANSWER_ENDPOINT_URL,
        config.USER_API_KEY
    );
    const vectorService = new VectorService(qdrantClient);

    await vectorService.createCollection();

    const files = await reportService.downloadAndExtractFiles();
    const embeddings = await openAiService.getEmbeddings(files);

    await vectorService.insertPoints(
        embeddings.map((e, index) => ({
            id: randomUUID(),
            payload: { date: e.filename.split(".")[0] },
            vector: e.embedding,
        }))
    );

    const questionEmbedding = await openAiService.getCachedEmbedding(QUESTION);
    const pointFromDb = await vectorService.queryVectors(questionEmbedding);
    const pointPayload = pointFromDb.points[0].payload;

    const reportResponse = await reportService.reportAnswer(
        pointPayload!!["date"] as string
    );
    console.log(reportResponse);
};

main();
