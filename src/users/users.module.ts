import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./users.model";
import {UsersController} from "./users.controller";
import {UserResponse, UsersService} from "./users.service";
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        HttpModule,
        UserResponse
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule{}