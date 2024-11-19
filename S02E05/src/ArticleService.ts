import fs from "fs"
import { OpenAiService } from "./OpenAiService"
import { AnsweredQuestion, ArticleAnswers, Question } from "./types"
import { load } from "cheerio"

export class ArticleService {
    private downloadArticleUrl: string
    private downloadQuestionsUrl: string
    private reportArticleAnswersUrl: string
    private userApiKey: string
    private openAiService: OpenAiService
    private articleBaseDomain = "https://centrala.ag3nts.org/dane"

    private articleMarkdownDirectory = "./markdown"
    private acrticleMarkdownFilePath = `${this.articleMarkdownDirectory}/article.md`

    private answersDirectory = "./answers"
    private answersFilePath = `${this.answersDirectory}/answers.json`

    constructor(
        downloadArticleUrl: string, 
        userApiKey: string,
        reportArticleAnswersUrl: string,
        openAiService: OpenAiService
    ) {
        this.downloadArticleUrl = downloadArticleUrl
        this.downloadQuestionsUrl = `https://centrala.ag3nts.org/data/${userApiKey}/arxiv.txt`
        this.reportArticleAnswersUrl = reportArticleAnswersUrl
        this.userApiKey = userApiKey
        this.openAiService = openAiService
    }

    async getQuestions(): Promise<Question[]> {
        const response = await fetch(this.downloadQuestionsUrl)
        const text = (await response.text()).trim()
        const questions = text.split("\n").map(q => {
            const [id, question] = q.split("=")
            return {
                id: id,
                question
            }
        })

        return questions
    }

    async getArticleAsMarkdown() {
        const markdownFile = this.openMarkdownFile()

        if (markdownFile) {
            console.log("return cached markdown")
            return markdownFile
        } else {
            const response = await fetch(this.downloadArticleUrl)
            const html = await response.text()
    
            const $ = load(html)
            let markdown = ''

            for (const heading of $("h2")) {
                if (!$(heading).text().includes("Abstrakt") && !$(heading).text().includes("Źródła")) {
                    markdown += `## ${$(heading).text()}\n\n`

                    for (const element of $(heading).nextUntil("h2")) {
                        if ($(element).is("p") && $(element).text().trim().length > 0) {
                            markdown += `${$(element).text()}\n\n`

                        } else if ($(element).is("figure")) {
                            const imageUrl = $(element).find("img").attr("src")
                            const fullImageUrl = `${this.articleBaseDomain}/${imageUrl}`
                            const caption = $(element).find("figcaption").text()

                            const res = await this.openAiService.describeImage(fullImageUrl, caption)
                            markdown += `<img>\n${res}\n</img>\n<caption>\n${caption}\n</caption>\n\n`

                            console.log(`described image: ${imageUrl}`)

                        } else if ($(element).is("audio")) {
                            const audioUrl = $(element).find("source").attr("src")
                            const fullAudioUrl = `${this.articleBaseDomain}/${audioUrl}`

                            const res = await this.openAiService.transcribeAudio(fullAudioUrl)
                            markdown += `<audio>\n${res}\n</audio>\n\n`

                            console.log(`described audio: ${audioUrl}`)
                        }
                    }
                }
            }

            fs.mkdirSync(this.articleMarkdownDirectory, { recursive: true })
            fs.writeFileSync(this.acrticleMarkdownFilePath, markdown, {
                encoding: "utf-8"
            })
    
            return markdown
        }
    }

    async answerQuestions(questions: Question[], article: string): Promise<AnsweredQuestion[]> {
        const answersFile = this.openAnswersFile()

        if (answersFile) { 
            console.log("return cached answers")
            const cachedAnswers = JSON.parse(answersFile) as AnsweredQuestion[]

            for (const q of questions) {
                const answer = cachedAnswers.find(a => a.question.id === q.id)
                if (!answer) {
                    console.log("Cache miss")
                    const newAnswer = await this.openAiService.answerQuestion(q.question, article)
                    console.log(`answered question: ${q.id}\nanswer: ${newAnswer?.answer}\nthinking: ${newAnswer?.thinking}\n\n`)

                    if (newAnswer) {
                        cachedAnswers.push({
                            question: q,
                            answer: newAnswer?.answer
                        } as AnsweredQuestion)
                    } else {
                        throw new Error("Failed to answer the question")
                    }
                } else {
                    console.log("Cache hit")
                }
            }

            fs.truncateSync(this.answersFilePath)
            fs.writeFileSync(this.answersFilePath, JSON.stringify(cachedAnswers), {
                encoding: "utf-8"
            })

            return cachedAnswers
        } else {
            const answers = await Promise.all(questions.map(async q => {
                const answer = await this.openAiService.answerQuestion(q.question, article)
                console.log(`answered question: ${q.id}\nanswer: ${answer?.answer}\nthinking: ${answer?.thinking}\n\n`)
    
                if (answer) {
                    return {
                        question: q,
                        answer: answer?.answer
                    } as AnsweredQuestion
                } else {
                    throw new Error("Failed to answer the question")
                }
            }))

            fs.mkdirSync(this.answersDirectory, { recursive: true })
            fs.writeFileSync(this.answersFilePath, JSON.stringify(answers), {
                encoding: "utf-8"
            })
    
            return answers
        }
    }

    async reportAtricleAnswers(answers: AnsweredQuestion[]) {
        const allAnswers: ArticleAnswers = {}
        answers.forEach(a => {
            allAnswers[a.question.id] = a.answer
        })

        const response = await fetch(this.reportArticleAnswersUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                task: "arxiv",
                apikey: this.userApiKey,
                answer: allAnswers
            }),
        })

        return response.json()
    }

    private openMarkdownFile() {
        try {
            const markdownFile = fs.readFileSync(this.acrticleMarkdownFilePath, "utf-8")
            return markdownFile
        } catch (error) {
            return undefined
        }
    }

    private openAnswersFile() {
        try {
            const answersFile = fs.readFileSync(this.answersFilePath, "utf-8")
            return answersFile
        } catch (error) {
            return undefined
        }
    }   
}