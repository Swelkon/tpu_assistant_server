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
        console.log("RaspController/POST getRasp: sending response:", response)
        return response
    }

}