export const describeImageSystemPrompt = (documentContent: string) => `
<objective>
You are given an image and your task is to look for any text in the image and return it back.
Additionally, you posses a markdown document from a notebook that consists the given image. You should use the document to derive missing information from the image.
</objective>

<rules>
- Return the whole text content present you found in the image. Separate each bulk of text with a semicolon.
- The text contents of the image might be incomplete or hard to read. In such cases use the attached document and your own knowladge to derive the missing information.
- DO NOT MAKE UP WORDS!
- Make sure your answer is a valid JSON object that starts with { and ends with }.
</rules>

<response_structure>
{
    "_thinking": "string",
    "answer": "string"
}

- _thinking: Your thinking process while analyzing the image.
- imageDescription: The text found in the image .
</response_structure>

<document>
${documentContent}
</document>

<examples>
USER: <an image containing the text "Hello, World!">
ASSISTANT:
{
    "_thinking": "I see an image containing the text 'Hello, World!'. I will return the text found in the image.",
    "answer": "Hello, World!"
}

---
USER: <an image depicting school kids, one of them holds a sign saying "Welcome to School">
ASSISTANT:
{
    "_thinking": "I see an image depicting school kids, one of them holds a sign saying 'Welcome to School'. I will return the text found in the image.",
    "answer": "Welcome to School"
}

---
USER: <an image of 3 post notes, first one says "Buy Milk", second one says "Call Mom", third one says "Finish Homework">
ASSISTANT:
{
    "_thinking": "I see an image showing 3 post notes. First note says 'Buy Milk', second note says 'Call Mom', and the third note says 'Finish Homework'. I will return contents of all the notes found in the image.",
    "answer": "Buy Milk; Call Mom; Finish Homework"
}

---
USER: <an image of a piece of paper that was torn, only a part of the text is visible, saying "Yesterday I went to the park and saw a beautiful...". The rest is cropped.>
ASSITANT:
{
    "_thinking": "I see a piece of paper with text 'Yesterday I went to the park and saw a beautiful...'. The text is incomplete, but I can see in the document that the subject of the sentence went to the park to observe birds. I will return the text found in the image.",
    "answer": "Yesterday I went to the park and saw a beautiful bird."
}

---
USER: <an image of a book page, the text is blurry and hard to read, only a part of the text is visible, saying "The quick brown fox jumps over the lazy...". The rest is cropped.>
ASSISTANT:
{
    "_thinking": "I see a book page with text 'The quick brown fox jumps over the lazy...'. The text is blurry and incomplete, but I can see in the document that the subject of the sentence is a dog. I will return the text found in the image.",
    "answer": "The quick brown fox jumps over the lazy dog."
}
---
USER: <an image of a book page, the text is blurry and hard to read, only a part of the text is visible, saying "My favorite place in New.." and then "..., right next to the Empire State Building". The rest is cropped.>
ASSISTANT:
{
    "_thinking": "I see a book page with text 'My favorite place in New...' and '..., right next to the Empire State Building'. The text is incomplete, but I can see in the document that the subject of the sentence is talking about New York. I will return the text found in the image.",
    "answer": "My favorite place in New York, right next to the Empire State Building."
}
</examples>
`;

export const describePageImagesSystemPrompt = `
<objective>
You are given an image of PDF page and your task is to look for any objects different than text in describe them.
Additionally, you posses a markdown document from a notebook that consists the given image. You should use the document to derive missing information from the image.
</objective>

<rules>
- Return the description of all the objects found in the image, except the text.
- Use the text as a context to describe the objects.
- Make separate descriptions for each object found in the image.
- Return a valid JSON object with that starts with { and ends with }. No other information should be included. 
<rules>

<response_structure>
{
    "_thinking": "string",
    "answer": ["string"]
}
Where:
- _thinking: Your thinking process while analyzing the image.
- answer: A list of strings, containing descriptions of the objects found in the image.
`;
