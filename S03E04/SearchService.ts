import { BARABARA, RESTRICTED_DATA } from "./constants";
import { OpenAiService } from "./OpenAiService";
import {
    InformationFromNote,
    PeopleInCity,
    PersonCities,
    SearchRequest,
    SearchResponse,
} from "./types";

export class SearchService {
    private openAiService: OpenAiService;
    private searchPeopleUrl: string;
    private searchPlacesUrl: string;
    private barabaraDataUrl: string;
    private userApiKey: string;

    constructor(
        openAiService: OpenAiService,
        searchPeopleUrl: string,
        searchPlacesUrl: string,
        barabaraDataUrl: string,
        apiKey: string
    ) {
        this.openAiService = openAiService;
        this.searchPeopleUrl = searchPeopleUrl;
        this.searchPlacesUrl = searchPlacesUrl;
        this.barabaraDataUrl = barabaraDataUrl;
        this.userApiKey = apiKey;
    }

    async searchPersonLocations(name: string) {
        return this.search(name, this.searchPeopleUrl);
    }

    async searchCityVisitors(city: string) {
        return this.search(city, this.searchPlacesUrl);
    }

    async getBarabaraNote(): Promise<string> {
        const response = await fetch(this.barabaraDataUrl);
        return response.text();
    }

    // get all people - is there restricted info, try all cities
    // find all cities where barbara is mentioned
    async findBarbaraLocation(people: string[]) {
        const barbaraLocations = new Set<string>();
        const allCitites = new Set<string>();
        const checkedPeople = new Set<string>();

        let numberOfCities;
        let peopleList = people;

        do {
            numberOfCities = allCitites.size;
            const peopleLocations = await Promise.all(
                peopleList.map(async (person) => {
                    const response = await this.searchPersonLocations(person);
                    return {
                        name: this.removePolishDiacritics(person),
                        cities: response.message,
                    } as PersonCities;
                })
            );

            const newCities = new Set<string>();
            peopleLocations.forEach((person) => {
                {
                    checkedPeople.add(person.name);
                    if (person.cities !== RESTRICTED_DATA) {
                        const citiesVisited = person.cities.split(" ");
                        if (person.name === BARABARA) {
                            citiesVisited.forEach((city) =>
                                barbaraLocations.add(city)
                            );
                        }

                        citiesVisited.forEach((city) => allCitites.add(city)); // these are new citites to check
                        citiesVisited.forEach((city) => newCities.add(city));
                    }
                }
            });

            const peopleInLocation = await Promise.all(
                Array.from(newCities)
                    .filter((city) => /^[A-Z].+$/.test(city)) // only capital letters
                    .map(async (city) => {
                        const response = await this.searchCityVisitors(city);
                        return {
                            city: city,
                            people: response.message,
                        } as PeopleInCity;
                    })
            );

            const peopleInLocationWithoutRestricted = peopleInLocation.filter(
                (cityInfo) => cityInfo.people !== RESTRICTED_DATA
            );
            peopleInLocationWithoutRestricted.forEach((location) => {
                const peopleInCity = location.people.split(" ");
                if (peopleInCity.includes(BARABARA)) {
                    barbaraLocations.add(location.city);
                }
                allCitites.add(location.city);
            });

            const newPeople = peopleInLocationWithoutRestricted
                .flatMap((location) => location.people.split(" "))
                .map((person) => this.removePolishDiacritics(person))
                .filter((person) => !checkedPeople.has(person));
            peopleList = newPeople;
        } while (numberOfCities < allCitites.size);

        return barbaraLocations;
    }

    private removePolishDiacritics(word: string) {
        const polishDiacriticsRegex = /^.*(Ą|Ę|Ó|Ć|Ś|Ż|Ź|Ł|Ń).*$/;
        const polishDiacriticsMap: { [key: string]: string } = {
            Ą: "A",
            Ę: "E",
            Ó: "O",
            Ć: "C",
            Ś: "S",
            Ż: "Z",
            Ź: "Z",
            Ł: "L",
            Ń: "N",
        };

        if (polishDiacriticsRegex.test(word)) {
            return word
                .split("")
                .map((char) => polishDiacriticsMap[char] || char)
                .join("");
        } else {
            return word;
        }
    }

    private async search(query: string, url: string): Promise<SearchResponse> {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: query, apikey: this.userApiKey }),
        });

        return JSON.parse(await response.text()) as SearchResponse;
    }
}
