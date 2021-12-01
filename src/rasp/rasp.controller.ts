import {Controller, Get, Post, Query, Request, UseGuards} from "@nestjs/common";
import {RaspService} from "./rasp.service";
import {AuthGuard} from "@nestjs/passport";

@Controller('rasp')
export class RaspController {

    constructor(
        private readonly raspService: RaspService
    ) {}

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