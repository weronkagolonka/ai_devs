import OpenAI from "openai";
import { globalConfig } from "../common/globalConfig";
import { getAnswer, initVerification, verify } from "./requests";

const main = async () => {
    const opneAIClient = new OpenAI({
        apiKey: globalConfig.OPEN_API_KEY,
    });

    const verifyQuestion = await initVerification(
        globalConfig.VERIFY_ENDPOINT_URL
    );
    console.log(verifyQuestion);

    const answer = await getAnswer(opneAIClient, verifyQuestion.text);
    console.log(answer);

    if (answer !== null) {
        const verification = await verify(globalConfig.VERIFY_ENDPOINT_URL, {
            text: answer,
            msgID: verifyQuestion.msgID,
        });

        console.log(verification);
    } else {
        console.error("Failed to get answer");
    }
};

main();
