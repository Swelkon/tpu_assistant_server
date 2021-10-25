import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import {mongooseConfig} from './config/mongoose.config';
import {UsersModule} from "./users/users.module";
import {ServerResponse} from "./model/ServerResponse";

@Module({
    imports: [MongooseModule.forRootAsync(mongooseConfig), UsersModule, ServerResponse],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
