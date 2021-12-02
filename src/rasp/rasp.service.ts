import {Inject, Injectable} from "@nestjs/common";
import {ApiTPU} from "../TPUApi/ApiTPU";
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

        const {
            timetable,
            new_access_token,
            new_refresh_token
        } = await this.apiTpu.getTimetableTPU(tokens.access_token, tokens.refresh_token)

        if (!timetable) {
            // return ServerResponse.sendRaspFail()
            return ServerResponse.sendAuthIsNeeded()
        }

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

    // async getRasp(chat_id: number, access_token: string) {
    //
    //     const tokens = this.usersService.getTpuTokens(user_id)
    //
    //     const timetable = await this.apiTpu.getTimetableTPU(access_token)
    //
    //     if (!timetable || timetable.code !== 200){
    //         return ServerResponse.sendRaspFail()
    //     }
    //
    //     const lessons = []
    //
    //     if (timetable.code === 200){
    //         for (let key in timetable){
    //             if (key !== "code"){
    //                 const lesson = {
    //                     "start": timetable[key]["start"],
    //                     "end": timetable[key]["end"],
    //                     "tip": timetable[key]["tip"], // другие варианты: "Практика","Лекция"
    //                     "place": timetable[key]["place"], // корпус и аудитория пары (пример в самом низу, где не null)
    //                     "event": timetable[key]["event"],
    //                     "disciplina": timetable[key]["disciplina"][0],
    //                     "lichnost": timetable[key]["lichnost"]
    //                 }
    //                 lessons.push(lesson)
    //             }
    //         }
    //
    //     }
    //
    //     const response = ServerResponse.sendRaspSuccess(lessons)
    //     return response
    //
    // }

}