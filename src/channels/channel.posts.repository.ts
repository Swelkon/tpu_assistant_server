import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {ChannelPost, ChannelPostDocument} from "./schemas/channel.post.model";
import {ChannelPostDto} from "./dtos/channel.post.dto";


@Injectable()
export class ChannelPostsRepository{

    constructor(@InjectModel(ChannelPost.name) private readonly channelPostModel: Model<ChannelPostDocument>) { }


    async createChannelPost(channelPostDto: ChannelPostDto) {
        const newPost = new this.channelPostModel({
            from_chat_id: channelPostDto.from_chat_id,
            message_id: channelPostDto.message_id,
            date: channelPostDto.date,
            is_poll: channelPostDto.is_poll
        });

        const result = await newPost.save();
        console.log(result)
        return result
    }


    async getChannelPosts(){
        const retrievedPosts = await this.channelPostModel.find().exec()
        return retrievedPosts
    }

}