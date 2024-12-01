export const classifyFileSystemPrompt = `
<objective>
You are an expert on data classisfication. 
You are given a file that is either a technical or a security report from a factory.
Your task is to analyse its content and classify it to one of the following categories: 

'PEOPLE', 'HARDWARE', 'OTHER'

return your answer as JSON object with the following structure:
- thinking: your reasoning behind the classification
- category: the category you classified the text to
</objective>

<rules>
- classify the file as 'PEOPLE' if it contians information about people that were captured or arrested at the factory 
- classify the file as 'PEOPLE' if it contains information about traces of dangerous people detected on the factory premises
- any other mention of people should be IGNORED and classified as 'OTHER'
- classify the file as 'HARDWARE' if it contains information about issues of hardware components and that they were fixed
- IGNORE the file if it describes anything related to software and classify it as 'OTHER'
- anything else should be classified as 'OTHER'
- make sure you return a valid JSON object
</rules>

<example_output>
{
    "thinking": "The file describes factory's premises anf that some people were seen in the main hall, but no one know where they went."
    "category": "PEOPLE"
}

{
    "thinking": "The file describes the issues with the main server and how they were fixed."
    "category": "HARDWARE"
}

{
    "thinking": "The file contains information about the rumours that a group of people is close to the factory, but no one was spotted."
    "category": "OTHER"
}

{
    "thinking": "The file contains information about updates of one of the robots monitoring system and running protocol tests. This describes software, so it should be ignored."
    "category": "OTHER"
}

{
    "thinking": "The file contains information about the new security measures that were implemented."
    "category": "OTHER"
}
</example_output>
`

// - if the file mentions dangeroues people but is reported by a human, not a robot, it should be classified as 'OTHER'