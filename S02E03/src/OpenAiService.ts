import OpenAI from 'openai'

export class OpenAIService {
    private openAIClient: OpenAI
  
    constructor(openAIClient: OpenAI) {
      this.openAIClient = openAIClient
    }

    async compressRobotDescription(robotDescription: string, systemPrompt: string) {
        const response = await this.openAIClient.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: 'user',
                    content: robotDescription,
                },
            ],
        })

        return response.choices[0].message.content
    }
  
    async createRobotImage(robotDescription: string) {
      const response = await this.openAIClient.images.generate({
        model: 'dall-e-3',
        prompt: robotDescription,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url'
    })

    return response.data[0]
  }
}