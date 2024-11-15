import { GetRobotDescriptionResponse } from "./types";

export class RobotService {
    private downloadReportUrl: string;
    private reportImageUrl: string;
    private userApiKey: string;

    constructor(reportImageUrl: string, userApiKey: string) {
        this.downloadReportUrl = `https://centrala.ag3nts.org/data/${userApiKey}/robotid.json`;
        this.reportImageUrl = reportImageUrl;
        this.userApiKey = userApiKey;
    }

    async getRobotDescription() {
        const response = await fetch(this.downloadReportUrl);
        return response.json() as Promise<GetRobotDescriptionResponse>;
    }
    
    async reportImage(imageUrl: string) {
        const response = await fetch(this.reportImageUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                task: "robotid",
                apikey: this.userApiKey,
                answer: imageUrl,
            }),
        });

        return response.json();
    }
}