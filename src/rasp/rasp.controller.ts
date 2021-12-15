import {Controller, Get, Post, Query, Request, UseGuards} from "@nestjs/common";
import {RaspService} from "./rasp.service";
import {AuthGuard} from "@nestjs/passport";
import {ApiBody, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AuthData} from "../model/AuthData";
import {ServerResponse} from "../model/ServerResponse";

@ApiTags('rasp')
@Controller('rasp')
export class RaspController {

    constructor(
        private readonly raspService: RaspService
    ) {}

    @ApiBody({type: AuthData})
    @ApiResponse({
        status: ServerResponse.STATUS_OK,
        type: ServerResponse,
        description: 'Успех. Данные расписания получены'
    })
    @ApiResponse({
        status: ServerResponse.STATUS_AUTH_NEEDED,
        description: 'Пользователь неавторизирован'
    })
    @UseGuards(AuthGuard('local'))
    @Post('')
    async getRasp(@Request() req){
        const response = await this.raspService.getRasp(req.user._id)
        return response
    }

    // @UseGuards(AuthGuard('local'))
    // @Post('')
    // async getRasp(@Query('chat_id') chat_id, @Query(`access_token`) access_token){
    //     const response = await this.raspService.getRasp(chat_id, access_token)
    //
    //     return response
    // }
}