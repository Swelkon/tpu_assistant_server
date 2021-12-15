import {ApiProperty} from "@nestjs/swagger";

export class AuthData<T>{
    @ApiProperty({description: "Идентификатор чата пользователя"})
    telegram_chat_id: number
    @ApiProperty({description: "Токен авторизованного пользователя"})
    telegram_token: string
    data: T
}