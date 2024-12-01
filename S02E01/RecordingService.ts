import decompress from "decompress"
import { OpenAIService } from "./OpenAIService"
import { systemPrompt } from "./prompt"
import { FindAddressResponse } from "./types"

export class RecordingService {
    private downloadRecordingsUrl: string
    private reportRecordingsUrl: string
    private userApiKey: string

    constructor(downloadRecordingsUrl: string, reportRecordingsUrl: string, userApiKey: string) {
        this.downloadRecordingsUrl = downloadRecordingsUrl
        this.reportRecordingsUrl = reportRecordingsUrl
        this.userApiKey = userApiKey
    }

    async getRecordings(): Promise<ArrayBuffer> {
        const response = await fetch(this.downloadRecordingsUrl, {  
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }})
        return response.arrayBuffer()
    }

    async reportData(data: string): Promise<any> {
        const response = await fetch(this.reportRecordingsUrl, {   
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                task: 'mp3',
                apikey: this.userApiKey,
                answer: data,
            })
        })
        return response.json()
    }

    async transcribeAndGetAddress(recordings: decompress.File[], openAIService: OpenAIService) {
        const possibleAdresses = recordings.map(async (recording) => {
            const asBlob = new Blob([recording.data], {type: recording.type})
            const asFile = new File([asBlob], recording.path, { type: recording.type })
            const transcription = await openAIService.speechToText(asFile)
            const addressInformation = await openAIService.createCompletion(transcription, systemPrompt)
            return addressInformation
        })
        return Promise.all(possibleAdresses)
    }
}