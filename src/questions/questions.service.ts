import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateQuestionDto } from './dtos/create-question.dto'
import { Question, QuestionDocument } from './schemas/question.schema'
import {ApiFAQ} from "../TPUApi/ApiFAQ";
import {HttpService} from "@nestjs/axios";
import {ServerResponse} from "../model/ServerResponse";

@Injectable()
export class QuestionsService {

    private apiFAQ: ApiFAQ

    constructor(
        @InjectModel(Question.name)
        private readonly _questionModel: Model<QuestionDocument>,
        private httpService: HttpService
    ) {
        this.apiFAQ = new ApiFAQ(httpService)
    }

    async createQuestion(createQuestionDto: CreateQuestionDto): Promise<void> {
        const question = await this._questionModel.create(createQuestionDto)
        await question.save()
    }

    async getFAQ(question: string) {

        const answer = await this.apiFAQ.getAnswerFAQ(question)

        if (!answer){
            return ServerResponse.sendServerFail()
        }
        return ServerResponse.sendFAQAnswer(answer);
    }
}
