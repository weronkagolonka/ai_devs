import { constants } from "./constants.js";

export const userPrompt = (htmlContent: string) => `
    Pracujesz ze stroną HTML.

    Potrzebujesz wydobyć informację z tagu <p> z id="${constants.QUESTION_HTML_ID}".
    Następnie odpowiedz na pytanie, które jest zawarte w tym tagu.
    Twoje rozwiązanie ma zawierać TYLKO odpowiedź na pytanie.
    
    Strona HTML:
    ${htmlContent}
`