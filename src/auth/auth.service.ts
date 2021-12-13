import {Injectable} from '@nestjs/common';
import {UsersService} from "../users/users.service";

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService) {
    }

    async validateUser(telegram_chat_id: number, telegram_token: string): Promise<any> {
        try {
            const user = await this.usersService.findUserByChatId(telegram_chat_id);
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
