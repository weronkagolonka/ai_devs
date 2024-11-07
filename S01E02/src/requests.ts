import OpenAI from "openai"
import { RobotMessage } from "./types"
import { systemPrompt } from "./prompts"

export const initVerification = async (url: string) => {
    const reponse = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: "READY",
            "msgID": "0"
        } as RobotMessage)
    })

    return reponse.json() as unknown as RobotMessage
}

export const getAnswer = async (client: OpenAI, question: string) => {
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: systemPrompt
            },
            {
                role: "user",
                content: question
            }
        ]
    })

    return response.choices[0].message.content;
}


export const verify = async (url: string, body: RobotMessage) => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    return response.json()
}