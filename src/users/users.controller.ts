import {Controller, Get, Param, Post, Query, Res} from "@nestjs/common";
import {UserResponse, UsersService} from "./users.service";
import {response} from "express";

@Controller('users')
export class UsersController{

    constructor( private readonly usersService: UsersService) {
    }

    @Get('')
    helloUser(){
        return("helloUser")
    }

    @Get('register')
    async register(@Query('code') code, @Query('state') state, @Res() res){
        await this.usersService.registerUser(code, state, res)
    }

    @Post('authorize/:chat_id')
    async authorize(@Param('chat_id') chat_id): Promise<UserResponse>{
        const response = await this.usersService.authorizeUser(chat_id)
        return response
    }



}