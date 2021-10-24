import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {User, UserDocument} from "./users.model";
import {HttpService} from "@nestjs/axios";
require('dotenv/config')

@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>,
                private httpService: HttpService) {
    }

    async registerUser(code, state, res) {

        console.log(`Got code = ${code}, state = ${state}, res = ${res}`)

        if (!code || !state) {
            return
        }

        const client_id = process.env.CLIENT_ID ;
        const client_secret = process.env.CLIENT_SECRET;
        const redirect_uri = process.env.REDIRECT_URL;

        try {

            console.log('Trying to get access_token')
            const accessTokenObservable = await this.httpService.get(`https://oauth.tpu.ru/access_token?client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}&code=${code}&grant_type=authorization_code`);
            const response = await accessTokenObservable.toPromise();
            const data = response.data

            const access_token = data.access_token;
            const api_key = process.env.API_KEY;

            console.log('Trying to get user data')
            const userObservable = await this.httpService.get(`https://api.tpu.ru/v2/auth/user?access_token=${access_token}&apiKey=${api_key}`);
            const userResponse = await userObservable.toPromise()
            const user = userResponse.data;

            console.log(`User:`, user)

            const newUser = new this.userModel({
                user_id: user.user_id,
                lichnost_id: user.lichnost_id,
                email: user.email,
                first_name: user.lichnost.imya,
                last_name: user.lichnost.familiya,
                telegram_chat_id: state
            });

            const result = await newUser.save();

            res.redirect(`https://t.me/tpu_assistant_bot?start=${code}`)

            console.log(result)

        } catch (e) {
            console.log("Error in registerUser")
            console.log(e)
        }

    }

    async authorizeUser(chat_id: number){
        console.log("triggered authorizeUser")
        try{
            const user = await this.userModel.findOne({telegram_chat_id: chat_id}).exec()
            return new UserResponse(0, "Success", user);
        } catch (e){
            console.log(e)
        }
        return new UserResponse(-1, "User not found", null);
    }

}

export class UserResponse {
    constructor(
        public status: number,
        public message: string,
        public data: any
    ) {
    }
}