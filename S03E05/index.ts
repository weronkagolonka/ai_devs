import { PathSegment } from "neo4j-driver";
import { globalConfig } from "../globalConfig";
import { DatabaseApiService } from "../S03E03/DatabaseApiService";
import { constants } from "./constants";
import { Neo4JService } from "./Neo4jService";
import { Connection, User } from "./types";
import { ReportAnswerRequest } from "../globalTypes";

const main = async () => {
    const dbApiService = new DatabaseApiService(
        globalConfig.DB_API_URL,
        globalConfig.USER_API_KEY
    );
    const neo4jService = new Neo4JService(
        globalConfig.NEO4J_URL,
        globalConfig.NEO4J_USERNAME,
        globalConfig.NEO4J_PASSWORD
    );

    const users = (await dbApiService.getUsers()).reply as User[];
    const connections = (await dbApiService.getConnections())
        .reply as Connection[];

    await neo4jService.batchUpsertNodes(constants.DB_LABEL, users);
    await neo4jService.batchConnectNodes(
        constants.DB_LABEL,
        connections,
        constants.DB_RELATIONSHIP
    );
    const pathFromRafalToBarbara =
        (await neo4jService.getNodePathByProperty(
            constants.DB_LABEL,
            constants.DB_RELATIONSHIP,
            { username: constants.RAFAL_USERNAME },
            { username: constants.BARABARA_USERNAME }
        )) || [];

    const peopleInPath = new Set<string>();
    pathFromRafalToBarbara[0]["segments"].forEach((s: PathSegment) => {
        peopleInPath.add(s.start.properties.username);
        peopleInPath.add(s.end.properties.username);
    });

    const peopleInPathAsString = Array.from(peopleInPath).join(", ");
    const reportResponse = await fetch(globalConfig.REPORT_ANSWER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            task: "connections",
            apikey: globalConfig.USER_API_KEY,
            answer: peopleInPathAsString,
        } as ReportAnswerRequest),
    });
    const responseBody = await reportResponse.json();
    console.log(responseBody);
};

main();
