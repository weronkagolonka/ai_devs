import OpenAI from "openai"
import { config } from "./config"
import { OpenAIService } from "./OpenAiService"
import { MapAnalyseService } from "./MapAnalyseService"
import { describeMapsSystemPrompt, findCitySystemPrompt } from "./prompt"

const main = async () => {
    const openAIClient = new OpenAI({
        apiKey: config.OPEN_API_KEY
    })
    const openAiService = new OpenAIService(openAIClient)
    const mapAnalyseService = new MapAnalyseService("assets")

    const pics = mapAnalyseService.loadMapPictures()
    // get description of the pictures
    const mapDescription = await openAiService.getPictureDescription(pics, describeMapsSystemPrompt)
    // use description to find the city

    if (mapDescription) {
        console.log(`MAPS:\n${mapDescription}`)
        const city = await openAiService.getCityName(mapDescription, findCitySystemPrompt)
        console.log(city)
    } else {
        console.error("Could not determine the city")
    }

}

main()