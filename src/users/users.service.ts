import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {ServerResponse} from "../model/ServerResponse";
import {ApiTPU} from "../ExternalApi/ApiTPU";
import {UsersRepository} from "./users.repository";
import {generate} from "rand-token";
import {TpuUser} from "./dtos/tpu.user";
import {TpuDataDto} from "./dtos/tpu.data.dto";

require('dotenv/config')

@Injectable()
export class UsersService {
    private apiTPU: ApiTPU
    private BOT_USERNAME = process.env.BOT_USERNAME

    constructor(
        private usersRepository: UsersRepository,
        private httpService: HttpService) {
        this.apiTPU = new ApiTPU(httpService);
    }

    // Метод для регистрации пользователей
    async registerUser(code, state, res) {
        console.log(`UsersService/registerUser: code = ${code}, state = ${state}, res = ${res}`)

        // Проверка параметров code и state
        if (!code || !state) {
            console.log("UsersService/registerUser: Error: Query params code or state not provided")
            return ServerResponse.sendCodeOrStateNotGiven()
        }

        // Получение пользователя с API TPU
        const userTpuData: TpuDataDto<TpuUser> = await this.apiTPU.getUserTPU(code)
        console.log("UsersService/registerUser: userTpuData:", userTpuData)

        // Проверке существования пользователя
        if (!userTpuData) {
            return ServerResponse.sendAuthIsNeeded()
        }

        let response: any

        // Генерация токена telegram_token и даты истечения срока его действия
        const telegram_token = generate(16)
        const expiration = new Date()
        expiration.setDate(expiration.getDate() + 6)
        console.log("UsersService/registerUser: set telegram_token:", telegram_token)
        console.log("UsersService/registerUser: set telegram_expiration_date:", expiration)

        // Проверка существования пользователя в базе данных
        if (await this.findUserByChatId(state)) {
            // Обновление данных пользователя в базе данных
            const updatedUserAcknowledged = await this.usersRepository.updateUser(state, userTpuData.access_token, userTpuData.refresh_token, telegram_token, expiration, userTpuData.data)
            response = updatedUserAcknowledged ? ServerResponse.sendSuccessfulUpdate() : ServerResponse.sendServerError(updatedUserAcknowledged)
        } else {
            // Сохранение пользователя в базе данных
            const savedUser = this.usersRepository.saveUser(state, userTpuData.access_token, userTpuData.refresh_token, telegram_token, expiration, userTpuData.data)
            response = savedUser ? ServerResponse.sendSuccessfulRegistration() : ServerResponse.sendServerError(savedUser)
        }

        console.log("UsersService/registerUser: server response:", response)

        // Переадресование в диалог с Телеграм-ботом
        if (response !== null && response.status == ServerResponse.STATUS_OK) {
            res.redirect(`https://t.me/${this.BOT_USERNAME}?start=${telegram_token}`)
        } else {
            res.redirect(`https://t.me/${this.BOT_USERNAME}?start=fail`)
        }
        return response

    }

    // Метод для авторизации пользователя
    async authorizeUser(user_id) {
        try {
            const user = await this.usersRepository.authorizeUser(user_id)
            console.log("UsersService/authorizeUser: user from repository:", user)

            if (user) {
                return ServerResponse.sendUserData(user);
            }

            return ServerResponse.sendUserNotFount()

        } catch (e) {
            return ServerResponse.sendServerError(e);
        }

    }

    // Метод для получения дополнительной информации о студенте
    async getStudentInfo(_id) {
        // Проверка, что пользователь - студент
        const user =  await this.usersRepository.confirmStudentRole(_id)
        console.log("UsersService/getStudentInfo: user from repository:", user)
        if ( !user.is_student ) {
            return ServerResponse.sendUserNotStudent()
        }

        const tokens = await this.getTpuTokens(_id)

        // Получение информациии о студенте через его access_token
        const studentInfoData = await this.apiTPU.getStudentInfo(tokens.access_token, tokens.refresh_token)
        console.log("UsersService/getStudentInfo: user info from ApiTPU:", studentInfoData)

        if (!studentInfoData) {
            return ServerResponse.sendAuthIsNeeded()
        }

        const studentInfo = studentInfoData.data

        // TODO: Не удалять. На случай, если профиль нужно обязательно обновлять
        // const new_access_token = studentInfoData.access_token
        // const new_refresh_token = studentInfoData.refresh_token
        // // Обновление access_token и refresh_token
        // await this.updateTpuTokens(_id, new_access_token, new_refresh_token)

        const response = ServerResponse.sendStudentInfo(studentInfo)
        return response
    }

    // Метод для поиска всех chat_id всех пользователей
    async getTelegramChatIds() {
        try {
            const chatIds = await this.usersRepository.getTelegramChatIds()
            console.log("UsersService/getTelegramChatIds: chatIds from repository:", chatIds)

            if (chatIds) {
                return ServerResponse.sendTelegramIds(chatIds)
            }

            return ServerResponse.sendCouldNotRetrieveTelegramIds()

        } catch (e) {
            return ServerResponse.sendServerError(e)
        }
    }

    // Метод для поиска пользователя по chat_id
    async findUserByChatId(telegram_chat_id: number) {
        return await this.usersRepository.findUserByChatId(telegram_chat_id)
    }

    // Метод для поиска access_token и refresh_token пользователя
    async getTpuTokens(_id) {
        return await this.usersRepository.findTpuTokens(_id)
    }

    // Метод для обновления access_token и refresh_token пользователя
    async updateTpuTokens(_id, access_token, refresh_token) {
        return await this.usersRepository.updateTpuTokens(_id, access_token, refresh_token)
    }

}
