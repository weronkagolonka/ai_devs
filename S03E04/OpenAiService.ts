import OpenAI from "openai";
import {
    determineCurentLocationPrompt,
    getNamesAndCitiesSystemPrompt,
} from "./prompt";
import fs from "fs";
import { InformationFromNote, LocationResponse } from "./types";

export class OpenAiService {
    private openAiClient: OpenAI;
    private cacheDirectory = "./S03E04/cache";
    private peopleFilePath = "./S03E04/cache/people.json";

    constructor(openAiClient: OpenAI) {
        this.openAiClient = openAiClient;
    }

    async getPeopleInfoFromNote(noteContent: string) {
        const cachedPeopleFile = this.openFile();

        if (cachedPeopleFile) {
            console.log("Using cached file");
            return cachedPeopleFile;
        } else {
            const data = await this.completion(
                getNamesAndCitiesSystemPrompt,
                noteContent
            );

            fs.mkdirSync(this.cacheDirectory, { recursive: true });
            fs.writeFileSync(this.peopleFilePath, data, {
                encoding: "utf8",
            });

            return JSON.parse(data) as InformationFromNote;
        }
    }

    async getCurrentLocation(noteContent: string, locations: string[]) {
        const locationResponse = await this.completion(
            determineCurentLocationPrompt(noteContent),
            locations.join(" ")
        );
        return JSON.parse(locationResponse) as LocationResponse;
    }

    private async completion(systemPrompt: string, input: string) {
        const response = await this.openAiClient.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: input,
                },
            ],
        });
        return response.choices[0].message.content || "";
    }

    private openFile() {
        try {
            const data = fs.readFileSync(this.peopleFilePath, "utf8");
            return JSON.parse(data) as InformationFromNote;
        } catch (error) {
            return undefined;
        }
    }
}
