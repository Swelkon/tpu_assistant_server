import {Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service";

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService) {
    }

    // Метод для верификации пользователя через telegram_chat_id и telegram_token
    async validateUser(telegram_chat_id: number, telegram_token: string): Promise<any> {
        try {
            const user = await this.usersService.findUserByChatId(telegram_chat_id);
            // Проверка переданного telegram_token на соответствие с сохраненным telegram_token
            if (user && user.telegram_token == telegram_token && new Date() < user.telegram_token_expiration_date) {
                const result = {
                    _id: user._id,
                    telegram_chat_id: user.telegram_chat_id,
                }
                return result
            }

            return null

        } catch (e) {
            return null
        }
    }

}
