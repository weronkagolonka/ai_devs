export type SearchRequest = {
    apikey: string;
    query: string;
};

export type SearchResponse = {
    code: number;
    message: string;
};

export type InformationFromNote = {
    people: PersonCities[];
};

export type PersonCities = {
    name: string;
    cities: string;
};

export type PeopleInCity = {
    city: string;
    people: string;
};

export type LocationResponse = {
    currentLocation: string;
    pastLocations: string[];
};
