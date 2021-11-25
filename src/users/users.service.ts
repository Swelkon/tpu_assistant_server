import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {ServerResponse} from "../model/ServerResponse";
import {ApiTPU} from "../TPUApi/ApiTPU";
import {UsersRepository} from "./users.repository";

require('dotenv/config')

@Injectable()
export class UsersService {
    private apiTPU: ApiTPU

    constructor(
                private usersRepository: UsersRepository,
                private httpService: HttpService) {
        this.apiTPU = new ApiTPU(httpService);
    }

    async registerUser(code, state, res) {
        console.log(`Module: UsersService\nMethod: registerUser\nReceived: code = ${code}, state = ${state}, res = ${res}`)

        // Check query params are given
        if (!code || !state) {
            console.log("Query params code or state not provided")
            return ServerResponse.sendCodeOrStateNotGiven()
        }

        // Get user from API TPU
        const userTpuDto = await this.apiTPU.getUserTPU(code)

        console.log("registerUser userTpuDto: ", userTpuDto)

        // Check if user is received from auth.tpu
        if (!userTpuDto || !userTpuDto.user_info || userTpuDto.user_info.code !== 200) {
            return ServerResponse.sendUserNotFromTPU()
        }

        let response: any

        // Check if there is a record with telegram_chat_id == state
        if (await this.usersRepository.findUserByChatId(state)) {
            const updatedUserAcknowledged = await this.usersRepository.updateUser(state, userTpuDto.access_token, userTpuDto.user_auth, userTpuDto.user_info["studies"][0])
            response = updatedUserAcknowledged ? ServerResponse.sendSuccessfulUpdate() : ServerResponse.sendServerError(updatedUserAcknowledged)
        } else {
            const savedUser = this.usersRepository.saveUser(state, userTpuDto.access_token, userTpuDto.user_auth, userTpuDto.user_info["studies"][0])
            response = savedUser ? ServerResponse.sendSuccessfulRegistration() : ServerResponse.sendServerError(savedUser)
        }

        if (response !== null && response.status == ServerResponse.STATUS_OK) {
            res.redirect(`https://t.me/tpu_assistant_bot?start=${userTpuDto.access_token}`)
        } else {
            res.redirect(`https://t.me/tpu_assistant_bot?start=fail`)
        }
        return response

    }

    async authorizeUser(chat_id: number, access_token: string) {
        try {
            const user = await this.usersRepository.authorizeUser(chat_id, access_token)

            return user == null
                ? ServerResponse.sendUserNotFount()
                : ServerResponse.sendUserData(user);
        } catch (e) {
            return ServerResponse.sendServerError(e);
        }

    }

}
