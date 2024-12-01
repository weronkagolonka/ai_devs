import {
    getAnswer,
    getLoginQuestion as getLoginPage,
    logIn,
} from "./requests.js";
import OpenAI from "openai";
import { globalConfig } from "../globalConfig.js";

const main = async () => {
    const openAiClient = new OpenAI({
        apiKey: globalConfig.OPEN_API_KEY,
    });

    const loginPageHtml = await getLoginPage(globalConfig.ENDPOINT_URL);

    const answer = await getAnswer(openAiClient, loginPageHtml);
    console.log(`Response from model: ${answer}`);

    if (answer !== null) {
        const loginResponse = await logIn(globalConfig.ENDPOINT_URL, {
            username: globalConfig.WEBSITE_USERNAME,
            password: globalConfig.WEBSITE_PASSWORD,
            answer: answer,
        });

        console.log("Response from login:\n");
        console.log(loginResponse);
    } else {
        console.error("Failed to get answer from the model");
    }
};

main();
