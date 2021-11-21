import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateQuestionDto } from './dtos/create-question.dto'
import { Question, QuestionDocument } from './schemas/question.schema'

@Injectable()
export class QuestionsService {
    constructor(
        @InjectModel(Question.name)
        private readonly _questionModel: Model<QuestionDocument>,
    ) {}

    async createQuestion(
        createQuestionDto: CreateQuestionDto,
    ): Promise<Question> {
        const question = await this._questionModel.create(createQuestionDto)
        question.createdAt = Date.now()
        await question.save()
        return question
    }

    async getAllQuestions(): Promise<Question[]> {
        const questions = await this._questionModel.find({})
        return questions
    }
}
