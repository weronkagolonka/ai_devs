import fs from "fs";

export class LocalJsonCache {
    private storageDirectory: string;

    constructor(storageDirectory: string) {
        this.storageDirectory = storageDirectory;
    }

    openFile<T>(filePath: string): T | undefined {
        try {
            const data = fs.readFileSync(
                `${this.storageDirectory}/${filePath}`,
                "utf8"
            );
            return JSON.parse(data) as T;
        } catch (error) {
            return undefined;
        }
    }

    saveFile<T>(filePath: string, data: T) {
        fs.mkdirSync(this.storageDirectory, { recursive: true });
        fs.writeFileSync(
            `${this.storageDirectory}/${filePath}`,
            JSON.stringify(data),
            {
                encoding: "utf8",
            }
        );
    }

    /**
     * Overwrites existing cache file
     */
    updateExistingFile<T>(filePath: string, data: T) {
        fs.truncateSync(filePath);
        fs.writeFileSync(
            `${this.storageDirectory}/${filePath}`,
            JSON.stringify(data),
            {
                encoding: "utf8",
            }
        );
    }
}
