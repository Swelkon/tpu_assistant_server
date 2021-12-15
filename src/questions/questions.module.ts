import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Question, QuestionSchema } from './schemas/question.schema'
import { QuestionsService } from './questions.service'
import {HttpModule} from "@nestjs/axios";
import {QuestionsController} from "./questions.controller";

@Module({
    imports: [
        HttpModule,
        MongooseModule.forFeature([
            { name: Question.name, schema: QuestionSchema },
        ]),
    ],
    controllers: [QuestionsController],
    providers: [QuestionsService],
    exports: [QuestionsService],
})
export class QuestionsModule {}
