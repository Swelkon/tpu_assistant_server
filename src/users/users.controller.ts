import {Controller, Get, Param, Post, Query, Req, Res} from "@nestjs/common";
import {UsersService} from "./users.service";
import {ServerResponse} from "../model/ServerResponse";

@Controller('users')
export class UsersController{

    constructor( private readonly usersService: UsersService) { }

    @Get('register')
    async register(@Query('code') code, @Query('state') state, @Res() res): Promise<ServerResponse<any>>{
        const response = await this.usersService.registerUser(code, state, res)
        console.log("EndPoint: register\nServerResponse:", response)
        return response
    }

    @Get('authorize')
    async authorize(@Query('chat_id') chat_id, @Query('access_token') access_token): Promise<ServerResponse<any>>{
        const response = await this.usersService.authorizeUser(chat_id, access_token)
        console.log("EndPoint: authorize\nServerResponse:", response)
        return response
    }



}