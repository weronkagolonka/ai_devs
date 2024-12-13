export class FineTuningService {
    prepareJson(data: string[], systemMessage: string, expectedAnswer: string) {
        return data.map((d) => {
            const system = {
                role: "system",
                content: systemMessage,
            };
            const user = {
                role: "user",
                content: d,
            };
            const assistant = {
                role: "assistant",
                content: expectedAnswer,
            };

            return {
                messages: [system, user, assistant],
            };
        });
    }
}
