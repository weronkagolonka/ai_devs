import express, { Request, Response, Application } from "express";
import { OpenAiService } from "./OpenAiService";
import {
    ErrorResponse,
    GetDronLocationRequest,
    GetDronLocationResponse,
} from "./types";

export class Server {
    private app: Application;
    private port: number;
    private openAiService: OpenAiService;

    constructor(port: number = 3000, openAiService: OpenAiService) {
        this.port = port;
        this.app = express();
        this.openAiService = openAiService;
        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    private initializeMiddlewares(): void {
        this.app.use(express.json());
    }

    private initializeRoutes(): void {
        this.app.post("/", this.handleInstruction);
    }

    private handleInstruction = async (
        req: Request<{}, {}, GetDronLocationRequest>,
        res: Response<GetDronLocationResponse | ErrorResponse>
    ): Promise<Response<GetDronLocationResponse | ErrorResponse>> => {
        try {
            const { instruction } = req.body;

            if (!instruction) {
                return res.status(400).json({
                    success: false,
                    status: 400,
                    message: "Instruction is required",
                } as ErrorResponse);
            }

            console.log(`Instruction: ${instruction}`);

            const dronLocation = await this.openAiService.getDronLocation(
                instruction
            );

            console.log(`flight path: ${dronLocation._thinking}`);

            return res.status(200).json(dronLocation.answer);
        } catch (error) {
            console.error("Error processing instruction:", error);
            return res.status(500).json({
                success: false,
                status: 500,
                message: "Internal server error",
            });
        }
    };

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`Server running at http://localhost:${this.port}`);
        });
    }
}
