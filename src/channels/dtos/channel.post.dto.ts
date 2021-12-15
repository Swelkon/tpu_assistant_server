import {ApiProperty} from "@nestjs/swagger";
import {Schema} from "mongoose";

export class ChannelPostDto {
    @ApiProperty({type: Number, description: 'Идентификатор чата отправителя'})
    from_chat_id: number
    @ApiProperty({type: Number, description: 'Идентификатор сообщения'})
    message_id: number
    @ApiProperty({type: Number, description: 'Дата отправления сообщения Unix'})
    date: number
    @ApiProperty({type: Number, description: 'Определяет, является ли сообщение голосованием'})
    is_poll: boolean

    constructor(from_chat_id: number, message_id: number, date: number, is_poll: boolean) {
        this.from_chat_id = from_chat_id
        this.message_id = message_id
        this.date = date
        this.is_poll = is_poll
    }
}