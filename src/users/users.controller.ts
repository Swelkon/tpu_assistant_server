import {Controller, Get, Param, Post, Query, Req, Request, Res, UseGuards} from "@nestjs/common";
import {UsersService} from "./users.service";
import {ServerResponse} from "../model/ServerResponse";
import {AuthGuard} from "@nestjs/passport";
import {ApiBody, ApiCreatedResponse, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AuthData} from "../model/AuthData";

@ApiTags('users')
@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {
    }

    @Get('register')
    @ApiResponse({
        status: ServerResponse.STATUS_OK,
        type: ServerResponse,
        description: 'Пользователь создан'
    })
    @ApiResponse({
        status: ServerResponse.STATUS_USER_NOT_FOUND,
        type: ServerResponse,
        description: 'Нужно авторизироваться через систему единой авторизации ТПУ'
    })
    @ApiResponse({
        status: ServerResponse.STATUS_SERVER_ERROR,
        description: 'Ошибка сервера'
    })
    @ApiQuery(
        {
            name: "code",
            description: "Параметр \"code\", который передается после успешной авторизации через систему Единой авторизации ТПУ",
            type: String,
            required: true
        }
    )
    @ApiQuery(
        {
            name: "state",
            description: "Параметр \"state\", содержащий идентификатор чата в Телеграме, который передается после успешной авторизации через систему Единой авторизации ТПУ",
            type: Number,
            required: true
        }
    )
    async register(@Query('code') code, @Query('state') state, @Res() res): Promise<ServerResponse<any>> {
        const response = await this.usersService.registerUser(code, state, res)
        console.log("EndPoint: register\nServerResponse:", response)
        return response
    }

    @ApiBody({type: AuthData})
    @ApiResponse({
        status: ServerResponse.STATUS_OK,
        type: ServerResponse,
        description: 'Пользователь авторизован'
    })
    @ApiResponse({
        status: ServerResponse.STATUS_AUTH_NEEDED,
        description: 'Пользователь неавторизирован'
    })
    @ApiResponse({
        status: ServerResponse.STATUS_SERVER_ERROR,
        description: 'Ошибка сервера'
    })
    @UseGuards(AuthGuard('local'))
    @Post('authorize')
    async authorize(@Request() req): Promise<any> {
        const response = await this.usersService.authorizeUser(req.user._id)
        console.log("EndPoint: authorize\nServerResponse:", response)
        return response

    }


    @ApiBody({type: AuthData})
    @ApiResponse({
        status: ServerResponse.STATUS_OK,
        type: ServerResponse,
        description: 'Успех. Идентификаторы телеграм-чатов получены'
    })
    @ApiResponse({
        status: ServerResponse.STATUS_AUTH_NEEDED,
        description: 'Пользователь неавторизирован'
    })
    @ApiResponse({
        status: ServerResponse.STATUS_SERVER_ERROR,
        description: 'Ошибка сервера'
    })
    @UseGuards(AuthGuard('local'))
    @Post('telegram')
    async getTelegramChatIds(@Request() req) {
        const response = await this.usersService.getTelegramChatIds()
        console.log("EndPoint: telegram\nServerResponse:", response)
        return response

    }

}