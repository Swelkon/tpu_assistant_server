import {Body, Controller, Get, Post} from "@nestjs/common";
import {ChannelPostDto} from "./dtos/channel.post.dto";
import {ChannelPostsService} from "./channel.posts.service";
import {ServerResponse} from "../model/ServerResponse";
import {ApiBody, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('channels')
@Controller('channels')
export class ChannelPostsController {

    constructor(private readonly channelPostsService: ChannelPostsService) {
    }

    @ApiBody({type: ChannelPostDto})
    @ApiResponse({
        status: ServerResponse.STATUS_OK,
        type: ServerResponse,
        description: 'Успех. Пост сохранен'
    })
    @ApiResponse({
        status: ServerResponse.STATUS_SERVER_ERROR,
        description: 'Ошибка сервера'
    })
    @Post('posts')
    async savePost(@Body() channelPostDto): Promise<ServerResponse<ChannelPostDto>> {
        const response = await this.channelPostsService.createChannelPost(channelPostDto)
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
        return response
    }

}