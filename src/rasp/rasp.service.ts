import {Inject, Injectable} from "@nestjs/common";
import {ApiTPU} from "../ExternalApi/ApiTPU";
import {HttpService} from "@nestjs/axios";
import {ServerResponse} from "../model/ServerResponse";
import {UsersService} from "../users/users.service";

@Injectable()
export class RaspService {

    private apiTpu: ApiTPU

    constructor(
        private usersService: UsersService,
        private httpService: HttpService
    ) {
        this.apiTpu = new ApiTPU(httpService)
    }

    async getRasp(user_id) {

        const tokens = await this.usersService.getTpuTokens(user_id)

        const timetableData = await this.apiTpu.getTimetableTPU(tokens.access_token, tokens.refresh_token)

        if (!timetableData) {
            return ServerResponse.sendAuthIsNeeded()
        }

        const timetable = timetableData.timetable
        const new_access_token = timetableData.new_access_token
        const new_refresh_token = timetableData.new_refresh_token

        console.log('RaspService: getRasp(): updating tpu tokens')
        console.log(`access_token: ${tokens.access_token}, refresh_token: ${tokens.refresh_token}\nnew_access_token: ${new_access_token} new_refresh_token: ${new_refresh_token}\n`)

        await this.usersService.updateTpuTokens(user_id, new_access_token, new_refresh_token)

        const lessons = []


        for (let key in timetable) {
            if (key !== "code") {
                const lesson = {
                    "id": key,
                    "start": timetable[key]["start"],
                    "end": timetable[key]["end"],
                    "tip": timetable[key]["tip"],
                    "place": timetable[key]["place"],
                    "event": timetable[key]["event"],
                    "disciplina": timetable[key]["disciplina"][0],
                    "lichnost": timetable[key]["lichnost"]
                }
                lessons.push(lesson)
            }
        }


        const response = ServerResponse.sendRaspSuccess(lessons)
        return response

    }

}