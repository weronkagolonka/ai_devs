import { AnonimisationService } from "./AnonimisationService";
import { config } from "./config"
import { LocalLlamaService } from "./LocalLlamaService"
import { systemPrompt } from "./prompt";

const main = async () => {
    const localLlamaService = new LocalLlamaService(config.LLAMA_MODEL);
    const anonimisationService = new AnonimisationService(
        config.REPORT_ENDPOINT_URL, 
        config.USER_API_KEY, 
        localLlamaService
    );
    
    const agentData = await anonimisationService.getAgentData();
    console.log(agentData);
    const anonimisedData = await localLlamaService.createCompletion(agentData, systemPrompt);
    console.log(anonimisedData);
    const reportResponse = await anonimisationService.reportAnonimisedAgentData(agentData);
    console.log(reportResponse);
}

main();