import OpenAI from "openai"
import { ArticleService } from "./ArticleService"
import { config } from "./config"
import { OpenAiService } from "./OpenAiService"

const main = async () => {
    const openAI = new OpenAI({
        apiKey: config.OPEN_API_KEY
    })
    const openAiService = new OpenAiService(openAI)
    const articleService = new ArticleService(
        config.DOWNLOAD_ARTICLE_URL,
        config.USER_API_KEY,
        config.REPORT_DATA_URL,
        openAiService
    )

    const questions = await articleService.getQuestions()
    const markdown = await articleService.getArticleAsMarkdown()

    const answeredQuestions = await articleService.answerQuestions(questions, markdown)
    console.log(answeredQuestions)

    const reportResponse = await articleService.reportAtricleAnswers(answeredQuestions)
    console.log(reportResponse)
}

main()