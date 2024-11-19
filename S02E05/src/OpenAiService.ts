import OpenAI from 'openai'
import { answerQuestionSystemPrompt, describeImageSystemPrompt } from './prompts'
import { Answer } from './types'

export class OpenAiService {
    private openAiClient: OpenAI

    constructor(openAiClient: OpenAI) {
        this.openAiClient = openAiClient
    }

    async describeImage(imageUrl: string, imageCaption: string): Promise<string | null> {
        const response = await this.openAiClient.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: describeImageSystemPrompt
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "image_url",
                            image_url: {
                                url: imageUrl
                            }
                        },
                        {
                            type: "text",
                            text: imageCaption
                        }
                    ]
                }
            ]
        })

        return response.choices[0].message.content
    }

    async answerQuestion(question: string, article: string): Promise<Answer | null> {
        const response = await this.openAiClient.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: [
                        {
                            type: "text",
                            text: answerQuestionSystemPrompt
                        },
                        {
                            type: "text",
                            text: article
                        }
                    ]
                },
                {
                    role: "user",
                    content: question
                }
            ]
        })

        const content = response.choices[0].message.content
        return content ? JSON.parse(content) as unknown as Answer : null
    }

    async transcribeAudio(audioUrl: string): Promise<string> {
        const downloadAudioResponse = await fetch(audioUrl)

        const response = await this.openAiClient.audio.transcriptions.create({
            file: downloadAudioResponse,
            model: 'whisper-1',
            response_format: 'json'
        })

        return response.text
    }
}