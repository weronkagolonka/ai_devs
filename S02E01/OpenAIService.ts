import OpenAI, { toFile } from 'openai'
import fs from 'fs'
import { FindAddressResponse } from './types'

export class OpenAIService {
  private openAIClient: OpenAI

  constructor(openAIClient: OpenAI) {
    this.openAIClient = openAIClient
  }

  async speechToText(audio: File): Promise<string> {
    const response = await this.openAIClient.audio.transcriptions.create({
        file: audio,
        model: "whisper-1",
        language: "pl",
        response_format: "json"
    })

    return response.text
  }

  async createCompletion(userPrompt: string, systemPrompt: string): Promise<FindAddressResponse | null> {
    const response = await this.openAIClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {role: "user", content: userPrompt},
        {role: "system", content: systemPrompt}
      ]
    })

    const content = response.choices[0].message.content;
    return content ? JSON.parse(content) as FindAddressResponse : null;
  }
}