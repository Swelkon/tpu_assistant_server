import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {User, UserDocument} from "./users.model";
import {HttpService} from "@nestjs/axios";
import {ServerResponse} from "../model/ServerResponse";

require('dotenv/config')

@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>,
                private httpService: HttpService) {
    }

    async registerUser(code, state, res) {
        console.log(`Module: UsersService\n
        Method: registerUser\n
        Received: code = ${code}, state = ${state}, res = ${res}`)

        if (!code || !state) {
            return
        }

        const client_id = process.env.CLIENT_ID;
        const client_secret = process.env.CLIENT_SECRET;
        const redirect_uri = process.env.REDIRECT_URL;

        try {
            // Get access_token from https://oauth.tpu.ru/access_token
            const accessTokenObservable = await this.httpService.get(`https://oauth.tpu.ru/access_token?client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}&code=${code}&grant_type=authorization_code`);
            const response = await accessTokenObservable.toPromise();

            const access_token = response.data.access_token;
            const api_key = process.env.API_KEY;

            // Get user data from https://api.tpu.ru/v2/auth/user
            const userObservable = await this.httpService.get(`https://api.tpu.ru/v2/auth/user?access_token=${access_token}&apiKey=${api_key}`);
            const userResponse = await userObservable.toPromise()
            const user = userResponse.data;

            console.log(user)

            const newUser = new this.userModel({
                user_id: user.user_id,
                lichnost_id: user.lichnost_id,
                email: user.email,
                first_name: user.lichnost.imya,
                last_name: user.lichnost.familiya,
                telegram_chat_id: state,
                access_token: access_token
            });

            const result = await newUser.save();
            console.log(result)

            res.redirect(`https://t.me/tpu_assistant_bot?start=${access_token}`)

        } catch (e) {
            console.log(e)
        }

    }

    async authorizeUser(chat_id: number) {
        try {
            const user = await this.userModel.findOne({telegram_chat_id: chat_id})
                .select({
                    '_id': 1,
                    'first_name': 1,
                    'last_name': 1,
                    'email': 1,
                    'telegram_chat_id': 1,
                    'access_token': 1
                })
                .exec()

            return user == null
                ? ServerResponse.sendUserNotFount()
                : ServerResponse.sendUserData(user);
        } catch (e) {
            return ServerResponse.sendServerError();
        }

    }

}
