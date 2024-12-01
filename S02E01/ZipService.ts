import decompress from "decompress"

export class ZipService {
    private decompress: (
        input: string | Buffer, 
        output?: string | decompress.DecompressOptions, 
        opts?: decompress.DecompressOptions
    ) => Promise<decompress.File[]>

    constructor(decompress: any) {
        this.decompress = decompress
    }

    async unzipRecordings(file: Buffer): Promise<decompress.File[]> {
        const recordings = await this.decompress(file)
        return recordings
    }
}