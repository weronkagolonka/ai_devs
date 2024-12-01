import { TASK_NAME } from "./constants";
import {
    DatabaseRequest,
    QueryResponse,
    ShowTableStructureResponse,
} from "./types";

export class DatabaseApiService {
    private apiUrl: string;
    private userApiKey: string;
    private CREATE_TABLE_STMT = "Create Table";

    constructor(apiUrl: string, userApiKey: string) {
        this.apiUrl = apiUrl;
        this.userApiKey = userApiKey;
    }

    async query(query: string) {
        const response = await fetch(this.apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                task: TASK_NAME,
                apikey: this.userApiKey,
                query,
            } as DatabaseRequest),
        });

        return response.json() as Promise<QueryResponse>;
    }

    async getTables() {
        const queryResponse = await this.query("show tables");
        return queryResponse;
    }

    /**
     * Retrieves CREATE TABLE statement for a given table
     */
    async getTableStructure(tableName: string) {
        const queryResponse = await this.query(
            `show create table ${tableName}`
        );
        const data = queryResponse as ShowTableStructureResponse;
        return data.reply[0][this.CREATE_TABLE_STMT];
    }
}
