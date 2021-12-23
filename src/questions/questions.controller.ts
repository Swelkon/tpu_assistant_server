import {Body, Controller, Post} from '@nestjs/common'
import {CreateQuestionDto} from "./dtos/create-question.dto";
import {QuestionsService} from "./questions.service";
import {ApiBody, ApiResponse, ApiTags} from "@nestjs/swagger";
import {FaqQuestionDto} from "./dtos/faq.question.dto";
import {ServerResponse} from "../model/ServerResponse";

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {

    constructor(private readonly questionsService: QuestionsService) {
    }

    // TODO: Не удалять, будущая фича для пополнения базы знаний QnA
    // @Post('question')
    // async saveQuestion(@Body() createQuestionDto: CreateQuestionDto){
    //     await this.questionsService.createQuestion(createQuestionDto)
    // }

    @ApiBody({type: FaqQuestionDto})
    @ApiResponse({
        status: ServerResponse.STATUS_OK,
        type: ServerResponse,
        description: 'Успех. Найден ответ на заданный вопрос'
    })
    @ApiResponse({
        status: ServerResponse.STATUS_SERVER_ERROR,
        description: 'Не получилось подключитья к базе знаний QnA'
    })
    @Post('faq')
    async getFAQ(@Body('question') question: string){
        const response = await this.questionsService.getFAQ(question);
        console.log("QuestionsController/POST getFAQ: sending response:", response)
        return response
    }
}
