import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {ServerResponse} from "../model/ServerResponse";
import {ApiTPU} from "../TPUApi/ApiTPU";
import {UsersRepository} from "./users.repository";
import {generate} from "rand-token";
import {Schema} from "mongoose";

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
        // if (!userTpuDto || !userTpuDto.user_info || userTpuDto.user_info.code !== 200) {
        if (!userTpuDto) {
            return ServerResponse.sendAuthIsNeeded()
        }

        let response: any

        const telegram_token = generate(16)
        const expiration = new Date()
        // expiration.setDate(expiration.getDate() + 6)
        expiration.setSeconds(expiration.getSeconds() + 15)

        // Check if there is a record with telegram_chat_id == state
        if (await this.usersRepository.findUserByChatId(state)) {
            const updatedUserAcknowledged = await this.usersRepository.updateUser(state, userTpuDto.access_token, userTpuDto.refresh_token, telegram_token, expiration, userTpuDto.user_auth, userTpuDto.user_info["studies"][0])
            response = updatedUserAcknowledged ? ServerResponse.sendSuccessfulUpdate() : ServerResponse.sendServerError(updatedUserAcknowledged)
        } else {
            const savedUser = this.usersRepository.saveUser(state, userTpuDto.access_token, userTpuDto.refresh_token, telegram_token, expiration, userTpuDto.user_auth, userTpuDto.user_info["studies"][0])
            response = savedUser ? ServerResponse.sendSuccessfulRegistration() : ServerResponse.sendServerError(savedUser)
        }

        if (response !== null && response.status == ServerResponse.STATUS_OK) {
            res.redirect(`https://t.me/tpu_assistant_bot?start=${telegram_token}`)
        } else {
            res.redirect(`https://t.me/tpu_assistant_bot?start=fail`)
        }
        return response

    }

    async authorizeUser(user_id) {
        try {
            const user = await this.usersRepository.authorizeUser(user_id)

            return user == null
                ? ServerResponse.sendUserNotFount()
                : ServerResponse.sendUserData(user);
        } catch (e) {
            return ServerResponse.sendServerError(e);
        }

    }

    async findUserByChatId(telegram_chat_id: number) {
        return await this.usersRepository.findUserByChatId(telegram_chat_id)
    }

    async getTpuTokens(user_id){
        return await this.usersRepository.findTpuTokens(user_id)
    }

    async updateTpuTokens(user_id, access_token, refresh_token){
        return await this.usersRepository.updateTpuTokens(user_id, access_token, refresh_token)
    }
}
