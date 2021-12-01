import {Module} from "@nestjs/common";
import {HttpModule} from "@nestjs/axios";
import {RaspController} from "./rasp.controller";
import {RaspService} from "./rasp.service";
import {UsersModule} from "../users/users.module";

@Module({
    imports: [
        HttpModule,
        UsersModule
    ],
    controllers: [RaspController],
    providers: [RaspService]
})
export class RaspModule{}
