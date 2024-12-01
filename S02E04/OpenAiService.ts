import OpenAI from 'openai'
import { classifyFileSystemPrompt } from './prompts'
import { ClassifyFileResponse, FileType } from './types'
import { ChatCompletionContentPart, ChatCompletionUserMessageParam } from 'openai/resources/index.mjs'
import decompress from 'decompress'

export class OpenAiService {
    private openAIClient: OpenAI

    constructor(openAIClient: OpenAI) {
        this.openAIClient = openAIClient
    }

    async classifyData(file: decompress.File, type: FileType) {
        let inputContent: ChatCompletionContentPart

        switch (type) {
            case 'text':
                inputContent = {
                    type: 'text',
                    text: file.data.toString('utf-8')
                }
                break
            case 'image':
                inputContent = {
                    type: 'image_url',
                    image_url: {
                        url: `data:image/png;base64,${file.data.toString('base64')}`
                    }
                }
                break
            case 'audio':
                inputContent = {
                    type: 'text',
                    text: await this.transcribeAudioFile(file)
                }
        }

        const response = await this.openAIClient.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: classifyFileSystemPrompt},
                {
                    role: 'user',
                    content: [inputContent]
                }
            ]
        })

        const content = response.choices[0].message.content
        return content ? JSON.parse(content) as ClassifyFileResponse : null
    }

    private async transcribeAudioFile(file: decompress.File) {
        console.log(`Transcribing audio file: ${file.path}`)
        
        const asBlob = new Blob([file.data], { type: file.type })
        const asFile = new File([asBlob], file.path, { type: file.type })
        const response = await this.openAIClient.audio.transcriptions.create({
            file: asFile,
            model: 'whisper-1',
            response_format: 'json'
        })

        return response.text
    }
}