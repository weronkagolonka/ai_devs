import OpenAI from 'openai'
import { FindCityResponse } from './types'

export class OpenAIService {
    private openAIClient: OpenAI
  
    constructor(openAIClient: OpenAI) {
      this.openAIClient = openAIClient
    }
  
    async getPictureDescription(pictures: Buffer[], systemPrompt: string): Promise<string | null> {
        const response = await this.openAIClient.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: pictures.map((pic) => {
                        return {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${pic.toString('base64')}`
                            }
                        }
                    })
                }
            ]
        })
        const content = response.choices[0].message.content

        return content ? content as unknown as string : null
    }

    async getCityName(description: string, systemPrompt: string): Promise<FindCityResponse | null> {
        const response = await this.openAIClient.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: description
                }
            ]
        })
        const content = response.choices[0].message.content

        return content ? content as unknown as FindCityResponse : null
    }
  }