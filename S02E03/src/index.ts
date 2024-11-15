import OpenAI from "openai"
import { OpenAIService } from "./OpenAiService"
import { RobotService } from "./RobotService"
import { config } from "./config"
import { compressRobotDescriptionSystemPrompt } from "./prompts"

const main = async () => {
    const openAI = new OpenAI({
        apiKey: config.OPEN_API_KEY
    })
    const openAiService = new OpenAIService(openAI)
    const robotService = new RobotService(
        config.REPORT_IMAGE_URL,
        config.USER_API_KEY
    )

    const robotDescriptionResponse = await robotService.getRobotDescription()

    console.log("Received robot description:")
    console.log(robotDescriptionResponse.description)
    console.log("\n")

    const compressedRobotDescription = await openAiService.compressRobotDescription(
        robotDescriptionResponse.description, 
        compressRobotDescriptionSystemPrompt
    )

    if (compressedRobotDescription) {
        console.log("Compressed robot description:")
        console.log(compressedRobotDescription)
        console.log("\n")

        const robotImage = await openAiService.createRobotImage(compressedRobotDescription)

        console.log("Generated robot image:")
        console.log(robotImage.url)

        if (robotImage.url) {
            const reportResponse = await robotService.reportImage(robotImage.url)
            console.log(reportResponse)
        } else {
            console.error("Failed to generate robot image")
        }
    } else {
        console.error("Failed to compress robot description")
    }
}

main()