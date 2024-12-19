import OpenAI from "openai";
import { globalConfig } from "../common/globalConfig";
import { OpenAiService } from "./OpenAiService";
import { Server } from "./Server";

const openAiClient = new OpenAI({
    apiKey: globalConfig.OPEN_API_KEY,
});
const openAiService = new OpenAiService(openAiClient);
const server = new Server(3000, openAiService);

server.start();
