import { AnonimisationService } from "./AnonimisationService";
import { globalConfig } from "../common/globalConfig";
import { LocalLlamaService } from "./LocalLlamaService";
import { systemPrompt } from "./prompt";

const main = async () => {
    const localLlamaService = new LocalLlamaService(globalConfig.LLAMA_MODEL);
    const anonimisationService = new AnonimisationService(
        globalConfig.REPORT_ANSWER_URL,
        globalConfig.USER_API_KEY,
        localLlamaService
    );

    const agentData = await anonimisationService.getAgentData();
    console.log(agentData);
    const anonimisedData = await localLlamaService.createCompletion(
        agentData,
        systemPrompt
    );
    console.log(anonimisedData);
    const reportResponse = await anonimisationService.reportAnonimisedAgentData(
        agentData
    );
    console.log(reportResponse);
};

main();
