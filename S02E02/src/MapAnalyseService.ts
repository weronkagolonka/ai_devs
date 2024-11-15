import fs from "fs"
import path from "path";

export class MapAnalyseService {
    private mapPicturesDirectory

    constructor(mapPicturesDirectory: string) {
        this.mapPicturesDirectory = mapPicturesDirectory
    }

    loadMapPictures(): Buffer[] {
        const mapPictures: Buffer[] = []
        const files = fs.readdirSync(this.mapPicturesDirectory)

        files.forEach(file => {
            const filePath = path.join(this.mapPicturesDirectory, file)
            const fileContent = fs.readFileSync(filePath)
            mapPictures.push(fileContent)
            
        })

        return mapPictures
    }
}