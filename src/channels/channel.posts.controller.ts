import {Body, Controller, Get, Post} from "@nestjs/common";
import {ChannelPostDto} from "./dtos/channel.post.dto";
import {ChannelPostsService} from "./channel.posts.service";
import {ServerResponse} from "../model/ServerResponse";


@Controller('channels')
export class ChannelPostsController {

    constructor(private readonly channelPostsService: ChannelPostsService) {
    }

    @Post('posts')
    async savePost(@Body() channelPostDto): Promise<ServerResponse<ChannelPostDto>> {
        const response = await this.channelPostsService.createChannelPost(channelPostDto)
        return response
    }

    @Get('posts')
    async getFreshPosts(){
        const response = await this.channelPostsService.getChannelPosts()
        return response
    }

}