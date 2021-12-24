import {Controller, Get, Param, Post, Query, Req, Request, Res, UseGuards} from "@nestjs/common";
import {UsersService} from "./users.service";
import {ServerResponse} from "../model/ServerResponse";
import {AuthGuard} from "@nestjs/passport";
import {ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AuthData} from "../model/AuthData";

@ApiTags('users')
@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {
    }

    @ApiOperation({
        summary: "Регистрация пользователей",
        description: "Позволяет связать Телеграм-аккаунт и корпоративный аккаунт пользователя ТПУ"
    })
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
    @Get('register')
    async register(@Query('code') code, @Query('state') state, @Res() res): Promise<ServerResponse<any>> {
        const response = await this.usersService.registerUser(code, state, res)
        console.log("UsersController/GET register: sending response:", response)
        return response
    }

    @ApiOperation({
        summary: "Авторизация пользователя через чат-бота",
        description: "Позволяет получить базовую информацию о пользователе: фамилия, имя и email"
    })
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
        console.log("UsersController/POST authorize: sending response:", response)
        return response

    }

    @ApiOperation({
        summary: "Получение дополнительной информации о студенте",
        description: "Позволяет получить дополнительную информацию об авторизованном студенте"
    })
    @ApiBody({type: AuthData})
    @ApiResponse({
        status: ServerResponse.STATUS_OK,
        type: ServerResponse,
        description: 'Успех. Получение дополнительной информации о студенте'
    })
    @ApiResponse({
        status: ServerResponse.STATUS_FORBIDDEN,
        description: 'Роль пользователя не студент'
    })
    @ApiResponse({
        status: ServerResponse.STATUS_SERVER_ERROR,
        description: 'Ошибка сервера'
    })
    @UseGuards(AuthGuard('local'))
    @Post('studentInfo')
    async getStudentInfo(@Request() req) {
        const response = await this.usersService.getStudentInfo(req.user._id)
        console.log("UsersController/POST getStudentInfo: sending response", response)
        return response
    }

    @ApiOperation({
        summary: "Получение telegram_chat_id сохраненных пользователей",
        description: "Позволяет получить telegram_chat_id всех сохраненных пользователей"
    })
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
        console.log("UsersController/POST telegram: sending response:", response)
        return response

    }

}