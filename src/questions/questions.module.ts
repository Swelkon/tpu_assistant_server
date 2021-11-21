import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Question, QuestionSchema } from './schemas/question.schema'
import { QuestionsService } from './questions.service'
import { QuestionsController } from './questions.controller'

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Question.name, schema: QuestionSchema },
        ]),
    ],
    providers: [QuestionsService],
    controllers: [QuestionsController],
    exports: [QuestionsService],
})
export class QuestionsModule {}
