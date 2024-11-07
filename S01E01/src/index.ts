import { config } from "./config.js"
import { getAnswer, getLoginQuestion as getLoginPage, logIn } from "./requests.js"
import OpenAI from "openai"

const main = async () => {
    const openAiClient = new OpenAI({
        apiKey: config.OPEN_API_KEY
    })

    const loginPageHtml = await getLoginPage(config.ENDPOINT_URL)
    
    const answer = await getAnswer(openAiClient, loginPageHtml)
    console.log(`Response from model: ${answer}`)

    if (answer !== null) {
        const loginResponse = await logIn(config.ENDPOINT_URL, {
            username: config.WEBSITE_USERNAME,
            password: config.WEBSITE_PASSWORD,
            answer: answer
        })

        console.log("Response from login:\n")
        console.log(loginResponse)
    } else {
        console.error("Failed to get answer from the model")
    }
}

main();