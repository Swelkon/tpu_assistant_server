import {Body, Controller, Get, Post} from '@nestjs/common'
import {CreateQuestionDto} from "./dtos/create-question.dto";
import {QuestionsService} from "./questions.service";

@Controller('questions')
export class QuestionsController {

    constructor(private readonly questionsService: QuestionsService) {
    }

    // @Post('question')
    // async saveQuestion(@Body() createQuestionDto: CreateQuestionDto){
    //     await this.questionsService.createQuestion(createQuestionDto)
    // }

    @Get('faq')
    async getFAQ(@Body('question') question: string){
        return await this.questionsService.getFAQ(question);
    }
}
