import { Body, Controller, Get, Post } from '@nestjs/common'
import { CreateQuestionDto } from './dtos/create-question.dto'
import { QuestionsService } from './questions.service'

@Controller('questions')
export class QuestionsController {
    constructor(private readonly _questionsService: QuestionsService) {}

    @Post() // Создание нового вопроса
    async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
        return this._questionsService.createQuestion(createQuestionDto)
    }

    @Get() // Получение списка всех вопросов
    async getAllQuestions() {
        return this._questionsService.getAllQuestions()
    }
}
