import { dir } from "console";
import unzipper from "unzipper";

export class ZipService {
    async extractZip(zip: Buffer, password: string | undefined = undefined) {
        // Implementation
        const directory = await unzipper.Open.buffer(Buffer.from(zip));
        return directory.files;
    }

    async getDataFromFile(file: unzipper.File) {
        const buffer = await file.buffer();

        return buffer.toString();
    }
}
