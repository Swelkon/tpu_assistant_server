import {ApiProperty} from "@nestjs/swagger";

export class FaqQuestionDto {
    @ApiProperty({description: "Текст спрашиваемого вопроса"})
    question: string
}