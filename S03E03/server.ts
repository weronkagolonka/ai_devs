import bodyParser from "body-parser";
import { DatabaseApiService } from "./DatabaseApiService";
import express from "express";
import { globalConfig } from "../common/globalConfig";

const app = express();
const port = 3000;

app.use(bodyParser.json());

const databaseApiService = new DatabaseApiService(
    globalConfig.DB_API_URL,
    globalConfig.USER_API_KEY
);

app.post("/query", async (req, res) => {
    console.log(req.body);
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: "Query string is required" });
    }

    try {
        const result = await databaseApiService.query(query);
        res.json(result);
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
