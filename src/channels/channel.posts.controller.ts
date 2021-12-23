import {Body, Controller, Get, Post, UseGuards} from "@nestjs/common";
import {ChannelPostDto} from "./dtos/channel.post.dto";
import {ChannelPostsService} from "./channel.posts.service";
import {ServerResponse} from "../model/ServerResponse";
import {ApiBody, ApiResponse, ApiTags} from "@nestjs/swagger";
import {AuthData} from "../model/AuthData";
import {AuthGuard} from "@nestjs/passport";

@ApiTags('channels')
@Controller('channels')
export class ChannelPostsController {

    constructor(private readonly channelPostsService: ChannelPostsService) {
    }

    @ApiBody({type: AuthData})
    @ApiResponse({
        status: ServerResponse.STATUS_OK,
        type: ServerResponse,
        description: 'Успех. Пост сохранен'
    })
    @ApiResponse({
        status: ServerResponse.STATUS_SERVER_ERROR,
        description: 'Ошибка сервера'
    })
    @UseGuards(AuthGuard('local'))
    @Post('posts')
    async savePost(@Body() channelPostDto: AuthData<ChannelPostDto>): Promise<ServerResponse<ChannelPostDto>> {
        const response = await this.channelPostsService.saveChannelPost(channelPostDto.data)
        console.log("ChannelPostsController/POST savePost: sending server response", response)
        return response
    }

    @ApiResponse({
        status: ServerResponse.STATUS_OK,
        type: ServerResponse,
        description: 'Успех. Посты получены'
    })
    @ApiResponse({
        status: ServerResponse.STATUS_SERVER_ERROR,
        description: 'Ошибка сервера'
    })
    @Get('posts')
    async getFreshPosts(){
        const response = await this.channelPostsService.getChannelPosts()
        console.log("ChannelPostsController/GET getFreshPosts: sending server response", response)
        return response
    }

}