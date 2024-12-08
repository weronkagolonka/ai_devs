import OpenAI from "openai";
import { ArticleService } from "./ArticleService";
import { globalConfig } from "../common/globalConfig";
import { OpenAiService } from "./OpenAiService";

const main = async () => {
    const openAI = new OpenAI({
        apiKey: globalConfig.OPEN_API_KEY,
    });
    const openAiService = new OpenAiService(openAI);
    const articleService = new ArticleService(
        globalConfig.DOWNLOAD_ARTICLE_URL,
        globalConfig.USER_API_KEY,
        globalConfig.REPORT_ANSWER_URL,
        openAiService
    );

    const questions = await articleService.getQuestions();
    const markdown = await articleService.getArticleAsMarkdown();

    const answeredQuestions = await articleService.answerQuestions(
        questions,
        markdown
    );
    console.log(answeredQuestions);

    const reportResponse = await articleService.reportAtricleAnswers(
        answeredQuestions
    );
    console.log(reportResponse);
};

main();
