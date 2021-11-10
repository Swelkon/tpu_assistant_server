import {Injectable} from "@nestjs/common";
import {ChannelPostDto} from "../model/data/dtos/ChannelPost.dto";
import {ChannelPostsRepository} from "./channel.posts.repository";
import {ServerResponse} from "../model/ServerResponse";


@Injectable()
export class ChannelPostsService{

    constructor(private channelPostsRepository: ChannelPostsRepository) {}


    async createChannelPost(channelPostDto: ChannelPostDto) {
        console.log("ChannelPostsService")
        if (!channelPostDto){
            return ServerResponse.sendBodyNotProvided()
        }

        const savedPost = await this.channelPostsRepository.createChannelPost(channelPostDto)
        if (savedPost){
            const savedPostDto = new ChannelPostDto(savedPost.from_chat_id, savedPost.message_id, savedPost.date, savedPost.is_poll)
            return ServerResponse.sendPostCreated(savedPostDto)
        } else {
            return ServerResponse.sendPostFailed()
        }
    }

    async getChannelPosts() {
        const retrievedPosts = await this.channelPostsRepository.getChannelPosts()
        const freshPosts = retrievedPosts.filter(this.publishedThisWeek)
        return ServerResponse.sendPostsRetrieved(freshPosts)
    }


    publishedThisWeek(post, index, array){
        const dateWeekAgo = Math.round(new Date().getTime() / 1000) - 604800
        return post.date > dateWeekAgo
    }
}


