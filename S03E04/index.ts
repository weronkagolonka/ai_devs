import { globalConfig } from "../globalConfig";
import { ReportAnswerRequest } from "../globalTypes";
import { OpenAiService } from "./OpenAiService";
import { SearchService } from "./SearchService";
import { OpenAI } from "openai";

const main = async () => {
    const openAi = new OpenAI({
        apiKey: globalConfig.OPEN_API_KEY,
    });
    const openAiService = new OpenAiService(openAi);
    const searchService = new SearchService(
        openAiService,
        globalConfig.SEARCH_PEOPLE_URL,
        globalConfig.SEARCH_PLACES_URL,
        globalConfig.BARABARA_DATA_URL,
        globalConfig.USER_API_KEY
    );

    const barbaraNote = await searchService.getBarabaraNote();
    const informationFromNote = await openAiService.getPeopleInfoFromNote(
        barbaraNote
    );

    const allPeople = informationFromNote.people.map((person) => person.name);
    const barbaraLocations = await searchService.findBarbaraLocation(allPeople);

    const currentLocation = await openAiService.getCurrentLocation(
        barbaraNote,
        Array.from(barbaraLocations)
    );
    const reportResponse = await fetch(globalConfig.REPORT_ANSWER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            task: "loop",
            apikey: globalConfig.USER_API_KEY,
            answer: currentLocation.currentLocation,
        } as ReportAnswerRequest),
    });
    const body = await reportResponse.json();

    console.log(body);
};

main();
