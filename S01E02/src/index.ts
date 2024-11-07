import OpenAI from "openai"
import { config } from "./config"
import { getAnswer, initVerification, verify } from "./requests"

 

const main = async () => {
    const opneAIClient = new OpenAI({
        apiKey: config.OPEN_API_KEY
    })

    const verifyQuestion = await initVerification(config.ENDPOINT_URL)
    console.log(verifyQuestion)

    const answer = await getAnswer(opneAIClient, verifyQuestion.text)
    console.log(answer)

    if (answer !== null) {
        const verification = await verify(config.ENDPOINT_URL, {
            text: answer,
            msgID: verifyQuestion.msgID
        })

        console.log(verification)  
    } else {
        console.error("Failed to get answer")
    }
}

main()