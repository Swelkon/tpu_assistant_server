import {Injectable, ValidationError} from "@nestjs/common";
import {ChannelPostDto} from "./dtos/channel.post.dto";
import {ChannelPostsRepository} from "./channel.posts.repository";
import {ServerResponse} from "../model/ServerResponse";


@Injectable()
export class ChannelPostsService {

    constructor(private channelPostsRepository: ChannelPostsRepository) {
    }


    async createChannelPost(channelPostDto: ChannelPostDto) {

        try {
            const savedPost = await this.channelPostsRepository.createChannelPost(channelPostDto)
            if (savedPost) {
                const savedPostDto = new ChannelPostDto(savedPost.from_chat_id, savedPost.message_id, savedPost.date, savedPost.is_poll)
                return ServerResponse.sendPostCreated(savedPostDto)
            } else {
                return ServerResponse.sendPostFailed()
            }

        } catch (e) {
            console.log(e)
            return ServerResponse.sendServerError(e)
        }

    }

    async getChannelPosts() {
        try {

            const retrievedPosts = await this.channelPostsRepository.getChannelPosts()
            const freshPosts = retrievedPosts.filter(this.publishedThisWeek)
            return ServerResponse.sendPostsRetrieved(freshPosts)
        } catch (e) {
            console.log(e)
            return ServerResponse.sendServerError(e)

        }
    }


    publishedThisWeek(post) {
        const dateWeekAgo = Math.round(new Date().getTime() / 1000) - 604800
        return post.date > dateWeekAgo
    }
}


