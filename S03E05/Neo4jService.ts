import neo4j, { Driver } from "neo4j-driver";
import { Connection } from "./types";

export class Neo4JService {
    private driver: Driver;

    constructor(uri: string, username: string, password: string) {
        this.driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
    }

    async batchUpsertNodes(label: string, nodes: Record<string, any>[]) {
        const cypher = `
            UNWIND $nodes AS node
            MERGE (n:${label} { id: node.id })
            SET n = node
            RETURN n
        `;
        const result = await this.runQuery(cypher, { nodes });
        return result?.records.map((record) => record.get("n").properties);
    }

    async batchConnectNodes(
        label: string,
        connections: Connection[],
        relationshipType: string
    ) {
        const cypher = `
            UNWIND $connections AS connection
            MERGE (user1:${label} { id: connection.user1_id })
            MERGE (user2:${label} { id: connection.user2_id })
            MERGE (user1)-[r:${relationshipType}]->(user2)
        `;
        await this.runQuery(cypher, { connections });
    }

    async getNodePathByProperty(
        label: string,
        relationshipType: string,
        fromProperty: Record<string, string>,
        toProperty: Record<string, string>
    ) {
        const [fromPropertyKey, fromPropertyValue] =
            Object.entries(fromProperty)[0];
        const [toPropertyKey, toPropertyValue] = Object.entries(toProperty)[0];

        const cypher = `
            MATCH path = SHORTEST 1 (from:${label})-[:${relationshipType}]-+(to:${label})
            WHERE from.${fromPropertyKey} = "${fromPropertyValue}" AND to.${toPropertyKey} = "${toPropertyValue}"
            RETURN path
        `;
        const result = await this.runQuery(cypher);
        return result?.records.map((record) => record.get("path"));
    }

    private async runQuery(cypher: string, params: Record<string, any> = {}) {
        const session = this.driver.session();
        let result;
        try {
            result = await session.run(cypher, params);
        } finally {
            await session.close();
            return result;
        }
    }
}
