import {Controller, Get, Param, Post, Query, Req, Res} from "@nestjs/common";
import {UsersService} from "./users.service";
import {ServerResponse} from "../model/ServerResponse";

@Controller('users')
export class UsersController{

    constructor( private readonly usersService: UsersService) {
    }

    @Get('register')
    async register(@Query('code') code, @Query('state') state, @Res() res){
        await this.usersService.registerUser(code, state, res)
    }

    @Post('authorize/:chat_id')
    async authorize(@Param('chat_id') chat_id): Promise<ServerResponse<any>>{
        const response = await this.usersService.authorizeUser(chat_id)
        return response
    }



}