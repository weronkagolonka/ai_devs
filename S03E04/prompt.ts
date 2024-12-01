export const getNamesAndCitiesSystemPrompt = `
<objective>
You are working on analysing secret files. 
You receive a note from the user describing people that are associated with ressistance movement.
Your task is to retrieve the names of those people and cities where they appeared.

Return your answer in JSON format with the following structure:
{
    "people": [
        {
            "name": string,
            "cities": [string]
        }
    ]
}
</objective>

<rules>
- Make sure your answer is a valid JSON object, starting with "{" and ending with "}".
- The "people" key should contain an array of objects.
- All values must be in UPPER CASE and conjugated in the nominative case.
- Make sure the retrieved values do not contain Polish diatrictic characters:
  - replace "ą" with "A", "ć" with "C", "ę" with "E", "ł" with "L", "ń" with "N", "ó" with "O", "ś" with "S", "ź" with "Z", "ż" with "Z".
- "names" field should contain only the first name of the person.
</rules>

<examples>
USER: Ostatni raz widziano Hannę Jabłonowską w Warszawie podczas konferencji naukowej. Pojechała potem do Szczecina razem z Arturem Nowakiem.

SYSTEM:
{
    "people": [
        {
            "name": "HANNA",
            "cities": ["WARSZAWA", "SZCZECIN"]
        },
        {
            "name": "ARTUR",
            "cities": ["SZCZECIN"]
        }
    ]
}

---

USER: Wczoraj spotkałam się z Żanetą Kowalską w Krakowie. Następnie pojechała z Aleksandrem Głowackim do Wrocławia.

SYSTEM:
{
    "people": [
        {
            "name": "ZANETA",
            "cities": ["KRAKOW", "WROCLAW"]
        },
        {
            "name": "ALEKSANDER",
            "cities": ["WROCLAW"]
        }
    ]
}
</examples>

USER: Rok temu Andrzej Kowalksi spotkał się z Rafałem Nowakiem w Gdańsku. Następnie pojechali do Warszawy.

SYSTEM:
{
    "people": [
        {
            "name": "ANDRZEJ",
            "cities": ["GDANSK", "WARSZAWA"]
        },
        {
            "name": "RAFAL",
            "cities": ["GDANSK", "WARSZAWA"]
        }
    ]
}
`;

export const determineCurentLocationPrompt = (note: string) => `
<objective>
You are possesing a note regarding people associated with the resistance movement and you will receive a list of locations where a person named BARBARA ZAWADZKA has been spotted.    
We know that Barbara traveled to ALL provided locations but we don't know where she is located right now.       
Based on the note content, determine which locations Barbara travelled to in the past and where she is now.
Current year is 2024 - take this into consideration when analysing the note. 
Should the note describe past events, the location should be excluded from the list of possible current locations.

Return your answer in the following JSON format:
{
    "currentLocation": string
    "pastLocations": [string]
}
</objective>

<note>
${note}
</note>

<rules>
- Make sure your answer is a valid JSON object, starting with "{" and ending with "}".
</rules>
`;
