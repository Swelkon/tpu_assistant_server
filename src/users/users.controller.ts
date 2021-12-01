import {Controller, Get, Param, Post, Query, Req, Request, Res, UseGuards} from "@nestjs/common";
import {UsersService} from "./users.service";
import {ServerResponse} from "../model/ServerResponse";
import {AuthGuard} from "@nestjs/passport";

@Controller('users')
export class UsersController{

    constructor( private readonly usersService: UsersService) { }

    @Get('register')
    async register(@Query('code') code, @Query('state') state, @Res() res): Promise<ServerResponse<any>>{
        const response = await this.usersService.registerUser(code, state, res)
        console.log("EndPoint: register\nServerResponse:", response)
        return response
    }

    @UseGuards(AuthGuard('local'))
    @Post('authorize')
    // async authorize(@Request() req, @Query('chat_id') chat_id, @Query('access_token') access_token): Promise<ServerResponse<any>>{
    async authorize(@Request() req): Promise<any>{
        const user = req.user
        if (user){
            console.log("user embedded to req: ", user)
            const response = await this.usersService.authorizeUser(user._id)
            console.log("EndPoint: authorize\nServerResponse:", response)
            return response
        }
        return { message: "Unauthorized, need to login"}
    }



}