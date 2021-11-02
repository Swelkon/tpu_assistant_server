import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {User, UserDocument} from "../model/data/users.model";
import {HttpService} from "@nestjs/axios";
import {ServerResponse} from "../model/ServerResponse";
import {ApiTPU} from "../TPUApi/ApiTPU";

require('dotenv/config')

@Injectable()
export class UsersService {
    private apiTPU: ApiTPU

    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>,
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
        const [user, access_token] = await this.apiTPU.getUserTPU(code)

        // Check if user is received from auth.tpu
        if (user == null) {
            return ServerResponse.sendUserNotFromTPU()
        }

        let response: any

        // Check if there is a record with telegram_chat_id == state
        if (await this.findUserByChatId(state)) {
            const updatedUser = await this.updateUser(state, access_token, user)
            response = updatedUser ? ServerResponse.sendSuccessfulUpdate() : ServerResponse.sendServerError(updatedUser)
        } else {
            const savedUser = this.saveUser(state, access_token, user)
            response = savedUser ? ServerResponse.sendSuccessfulRegistration() : ServerResponse.sendServerError(savedUser)
        }

        if (response !== null && response.status == ServerResponse.STATUS_OK) {
            res.redirect(`https://t.me/tpu_assistant_bot?start=${access_token}`)
        } else {
            res.redirect(`https://t.me/tpu_assistant_bot?start=fail`)
        }
        return response

    }

    async authorizeUser(chat_id: number, access_token: string) {
        try {
            const user = await this.userModel.findOne(
                {
                    $and: [
                        {
                            telegram_chat_id: chat_id
                        }, {
                            access_token: access_token
                        }
                    ]
                },
                {
                    '_id': 0,
                    'first_name': 1,
                    'last_name': 1,
                    'email': 1,
                    'telegram_chat_id': 1,
                }
            )
                .exec()

            return user == null
                ? ServerResponse.sendUserNotFount()
                : ServerResponse.sendUserData(user);
        } catch (e) {
            return ServerResponse.sendServerError(e);
        }

    }

    async findUserByChatId(chat_id: number) {
        try {
            const user = await this.userModel.findOne({telegram_chat_id: chat_id}, {
                    '_id': 0,
                    'telegram_chat_id': 1,
                }
            )
                .exec()

            return user
        } catch (e) {
            console.log(e)
            return null
        }
    }

    async saveUser(chat_id: number, access_token: string, user) {
        const newUser = new this.userModel({
            user_id: user.user_id,
            lichnost_id: user.lichnost_id,
            email: user.email,
            first_name: user.lichnost.imya,
            last_name: user.lichnost.familiya,
            telegram_chat_id: chat_id,
            access_token: access_token
        });

        const result = await newUser.save();
        console.log(result)
    }

    async updateUser(chat_id: number, access_token: string, user) {
        try {
            const updatedUser = await this.userModel.updateOne({
                    telegram_chat_id: chat_id
                },
                {
                    $set: {
                        user_id: user.user_id,
                        lichnost_id: user.lichnost_id,
                        email: user.email,
                        first_name: user.lichnost.imya,
                        last_name: user.lichnost.familiya,
                        telegram_chat_id: chat_id,
                        access_token: access_token
                    }
                }).exec()

            return updatedUser

        } catch (e) {
            return null
        }
    }


}
