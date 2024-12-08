export const getPhotoLinksPrompt = (
    previousLinks: string | undefined = undefined
) => `
<objective>
You are communicating with a bot that returns photo files. 
The bot is not very intelligent and it sometimes returns complete links to the photos, while other times it returns the photo information in other formats.
Your task is to interpret bot's message and extract all photo links from it.

${
    previousLinks
        ? `Here are the links that you have extracted so far: ${previousLinks}. Use it to construct new links if the bot does not respond with the base URL`
        : ""
}
</objective>

<response_structure>
{
    "_thinking": string,
    "answer": string[]
}

where:
- _thinking: is your reasoning behind the answer
- answer: an array of complete photo links
</response_structure>

<rules>
- make sure that the extracted links are valid and start with "http://" or "https://"
- make sure that your answer is a valid JSON object that starts with "{" and ends with "}"
- the bot migh not include the base URL in the message, but only the photo file names. In such case, you should use the previously extracted links to construct the complete links
</rules>

<examples>
// The base URL is shared in the message, and the photo file names are shared separately

USER: You can find all photos on http://example.com/photos, and I have 2 photos for you: photo1.jpg and photo2.jpg
ASSISTANT: 
{
    "_thinking": "I found 2 photo links in the message",
    "answer": ["http://example.com/photos/photo1.jpg", "http://example.com/photos/photo2.jpg"]
}

---
// The bot shares the photo links directly in the message

USER: There are 3 photos I can share with you: http://example.com/photo1.jpg, http://example.com/photo2.jpg, and http://example.com/photo
ASSISTANT:
{
    "_thinking": "I found 3 photo links in the message",
    "answer": ["http://example.com/photo1.jpg", "http://example.com/photo2.jpg", "http://example.com/photo"]
}
</examples>

---
// One photo link is complete, while the other photo is only shared as a file name
USER: Here is a photo for you: http://example.com/photo1.jpg, and I have another photo: photo2.jpg
ASSISTANT:
{
    "_thinking": "I found 2 photo links in the message",
    "answer": ["http://example.com/photo1.jpg", "http://example.com/photo2.jpg"]
}

---
// The bot shares only the photo file names but you have extracted the base URL from the previous messages
USER: I have 2 photos for you: photo1.jpg and photo2.jpg
ASSISTANT:
{
    "_thinking": "I found 2 photo names in the message, but the base URL is missing. I will use the previously extracted links to construct the complete links",
    "answer": ["http://example.com/photo1.jpg", "http://example.com/photo2.jpg"]
}
`;
