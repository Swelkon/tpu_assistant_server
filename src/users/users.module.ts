import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../model/data/users.model";
import {UsersController} from "./users.controller";
import {UsersService} from "./users.service";
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        HttpModule
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule{}