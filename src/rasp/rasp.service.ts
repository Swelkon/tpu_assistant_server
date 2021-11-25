import {Injectable} from "@nestjs/common";
import {ApiTPU} from "../TPUApi/ApiTPU";
import {HttpService} from "@nestjs/axios";
import {ServerResponse} from "../model/ServerResponse";

@Injectable()
export class RaspService {

    private apiTpu: ApiTPU

    constructor(
        private httpService: HttpService
    ) {
        this.apiTpu = new ApiTPU(httpService)
    }

    async getRasp(chat_id: number, access_token: string) {

        const timetable = await this.apiTpu.getTimetableTPU(access_token)

        if (!timetable || timetable.code !== 200){
            return ServerResponse.sendRaspFail()
        }

        const lessons = []

        if (timetable.code === 200){
            for (let key in timetable){
                if (key !== "code"){
                    const lesson = {
                        "start": timetable[key]["start"],
                        "end": timetable[key]["end"],
                        "tip": timetable[key]["tip"], // другие варианты: "Практика","Лекция"
                        "place": timetable[key]["place"], // корпус и аудитория пары (пример в самом низу, где не null)
                        "event": timetable[key]["event"],
                        "disciplina": timetable[key]["disciplina"][0],
                        "lichnost": timetable[key]["lichnost"]
                    }
                    lessons.push(lesson)
                }
            }

        }

        const response = ServerResponse.sendRaspSuccess(lessons)
        return response

    }

}