import {Controller, Get, Query} from "@nestjs/common";
import {RaspService} from "./rasp.service";

@Controller('rasp')
export class RaspController {

    constructor(
        private readonly raspService: RaspService
    ) {}

    @Get('')
    async getRasp(@Query('chat_id') chat_id, @Query(`access_token`) access_token){
        const response = await this.raspService.getRasp(chat_id, access_token)

        return response
    }
}