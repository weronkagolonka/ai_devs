export const getAnswersystemPrompt = (
    question: string,
    homePageUrl: string,
    links: string[]
): string => `
<objective>
You are analyzing a HTML page of a AI company website. The goal is to find the answer to the provided question.
The provided page content might not contain the answer. In such case, determine which hyperlink you should follow to find the answer.
</objective>

${
    links.length > 0
        ? `<visited_pages>\n${links
              .map((link) => ` - ${link}`)
              .join("\n")}\n</visited_pages>\n`
        : ""
}
<response_structure>
{
    "_thinking": string,
    "answer": {
        "type": "ANSWER" | "REDIRECT",
        "content": string
    }
}

where:
- "_thinking": is your reasoning behind the answer
- "answer": is the answer to the question or a hyperlink to the next page
</response_structure>

<home_page_url>
${homePageUrl}
</home_page_url>

<question>
${question}
</question>

<rules>
- Make sure your answer is a valid JSON object starting with "{" and ending with "}"
- If you cannot find the answer on the current page, provide a hyperlink to the next page you think could contain the answer. Set the "type" to "REDIRECT" and provide the link in the "content" field.
${
    links.length > 0
        ? "- Do not revisit pages - inspect the links provided in the <visited_links> section and select links from the HTML page that you haven't checked yet\n"
        : ""
}
${
    links.length > 0
        ? "- If you cannot find the answer and all hyperlinks on the page have been visited, return with the home page link\n"
        : ""
}
- If the current page contains the answer, set the "type" to "ANSWER" and provide the it in the "content" field. The answer should be short and concise.
- Make sure that the hyperlinks you provide are valid and start with "http://" or "https://".
</rules>
`;
