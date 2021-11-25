import {Module} from "@nestjs/common";
import {HttpModule} from "@nestjs/axios";
import {RaspController} from "./rasp.controller";
import {RaspService} from "./rasp.service";

@Module({
    imports: [
        HttpModule
    ],
    controllers: [RaspController],
    providers: [RaspService]
})
export class RaspModule{}
