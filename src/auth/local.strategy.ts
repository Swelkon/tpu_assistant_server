import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {AuthService} from "./auth.service";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private authService: AuthService) {
        super({
            usernameField: "telegram_chat_id",
            passwordField: "telegram_token"
        });
    }

    async validate(telegram_chat_id: number, telegram_token: string): Promise<any>{
        const user = await this.authService.validateUser(telegram_chat_id, telegram_token);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user
    }
}