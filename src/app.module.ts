import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import {mongooseConfig} from './config/mongoose.config';
import {UsersModule} from "./users/users.module";
import {ConfigModule} from "@nestjs/config";
import {ChannelPostsModule} from "./channels/channel.posts.module";
import { QuestionsModule } from './questions/questions.module';

@Module({
    // imports: [MongooseModule.forRootAsync(mongooseConfig), UsersModule, ServerResponse],
    imports: [
        // ConfigModule.forRoot({
        //     isGlobal: true
        // }),
        MongooseModule.forRootAsync(mongooseConfig),
        UsersModule,
        ChannelPostsModule,
        QuestionsModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
