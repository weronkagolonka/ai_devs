import { getSourceStrings, sendTaskAnswer } from "./requests.js";

const main = async () => {
    const sourceStrings = await getSourceStrings();
    const response = await sendTaskAnswer(sourceStrings);
    console.log(`Response: ${JSON.stringify(response)}`);
}

main();