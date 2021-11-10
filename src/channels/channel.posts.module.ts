import {Module} from "@nestjs/common";
import {ChannelPostsController} from "./channel.posts.controller";
import {ChannelPostsService} from "./channel.posts.service";
import {ChannelPostsRepository} from "./channel.posts.repository";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../model/data/schemas/users.model";
import {ChannelPost, ChannelPostSchema} from "../model/data/schemas/channel.post.model";


@Module({
    imports:[
        MongooseModule.forFeature([{name: ChannelPost.name, schema: ChannelPostSchema}]),
    ],
    controllers: [ChannelPostsController],
    providers: [ChannelPostsService, ChannelPostsRepository]
})
export class ChannelPostsModule{}