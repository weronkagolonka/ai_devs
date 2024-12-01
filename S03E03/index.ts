import OpenAI from "openai";
import { globalConfig } from "../globalConfig";
import { OpenAiService } from "./OpenAiService";
import { DatabaseApiService } from "./DatabaseApiService";
import { tableNames, TASK_NAME } from "./constants";
import { ReportAnswerRequest } from "./types";

const main = async () => {
    const openAi = new OpenAI({
        apiKey: globalConfig.OPEN_API_KEY,
    });
    const openAiService = new OpenAiService(openAi);
    const databseService = new DatabaseApiService(
        globalConfig.DB_API_URL,
        globalConfig.USER_API_KEY
    );

    const tableStructures = await Promise.all(
        Object.entries(tableNames).map(async (table) => {
            const [_, tableName] = table;
            const createStatement = await databseService.getTableStructure(
                tableName
            );

            return createStatement;
        })
    );

    const sqlQuery = await openAiService.getDatabaseQuery(tableStructures);
    const queryResult = await databseService.query(sqlQuery);
    const datacenterIds = queryResult.reply.flatMap((r) => Object.values(r));

    const reportResponse = await fetch(globalConfig.REPORT_ANSWER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            task: TASK_NAME,
            apikey: globalConfig.USER_API_KEY,
            answer: datacenterIds,
        } as ReportAnswerRequest),
    });
    const responseData = await reportResponse.json();
    console.log(responseData);
};

main();
