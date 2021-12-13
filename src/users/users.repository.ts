import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./schemas/users.model";
import {Model} from "mongoose";
import {GetUserAuthTpuDto} from "./dtos/get-user.auth.tpu.dto";
import {UserInfoTpu} from "./dtos/get-user.info.tpu.dto";

Injectable()
export class UsersRepository{

    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }

    async saveUser(chat_id: number, access_token: string, refresh_token: string,
                   telegram_token: string, expiration: Date,
                   user_auth: GetUserAuthTpuDto, user_info: UserInfoTpu) {
        console.log()
        const newUser = new this.userModel({
            user_id: user_auth.user_id,
            lichnost_id: user_auth.lichnost_id,
            email: user_auth.email,
            first_name: user_auth.lichnost.imya,
            last_name: user_auth.lichnost.familiya,
            telegram_chat_id: chat_id,
            gruppa: user_info.gruppa,
            department: user_info.department,
            direction_of_training: user_info.direction_of_training,
            form_of_education: user_info.form_of_education,
            type_of_financing: user_info.type_of_financing,
            access_token: access_token,
            refresh_token: refresh_token,
            telegram_token: telegram_token,
            telegram_token_expiration_date: expiration
        });

        const result = await newUser.save();
        console.log(result)
        return result
    }

    async authorizeUser(_id) {
        const user = await this.userModel.findOne(
            {
                _id: _id
            },
            {
                '_id': 0,
                'first_name': 1,
                'last_name': 1,
                'email': 1,
                'telegram_chat_id': 1,
                'gruppa': 1,
                'department': 1,
                'direction_of_training': 1,
                'form_of_education': 1,
                'type_of_financing': 1,
            }
        )

            .exec()

        console.log(`UsersRepository: authorizeUser()\n${user}`)
        return user
    }

    async findUserByChatId(chat_id: number) {
        const user = await this.userModel.findOne({telegram_chat_id: chat_id}, {
                '_id': 1,
                'telegram_chat_id': 1,
                'telegram_token': 1,
                'telegram_token_expiration_date': 1,
            }
        )
            .exec()

        console.log(`UsersRepository: findUserByChatId()\n${user}`)
        return user
    }

    async findTpuTokens(_id){
        const query = await this.userModel.findOne(
            {
                _id: _id
            },
            {
                '_id': 1,
                'access_token': 1,
                'refresh_token': 1
            }
        )
            .exec()

        return query
    }


    async updateUser(chat_id: number, access_token: string, refresh_token: string,
                     telegram_token: string, expiration: Date,
                     user_auth: GetUserAuthTpuDto, user_info: UserInfoTpu) {
        const updatedUser = await this.userModel.updateOne({
                telegram_chat_id: chat_id
            },
            {
                $set: {
                    user_id: user_auth.user_id,
                    lichnost_id: user_auth.lichnost_id,
                    email: user_auth.email,
                    first_name: user_auth.lichnost.imya,
                    last_name: user_auth.lichnost.familiya,
                    telegram_chat_id: chat_id,
                    gruppa: user_info.gruppa,
                    department: user_info.department,
                    direction_of_training: user_info.direction_of_training,
                    form_of_education: user_info.form_of_education,
                    type_of_financing: user_info.type_of_financing,
                    access_token: access_token,
                    refresh_token: refresh_token,
                    telegram_token: telegram_token,
                    telegram_token_expiration_date: expiration
                }
            }).exec()


        console.log(`UsersRepository: updateUser(): ${updatedUser.acknowledged}`)
        return updatedUser.acknowledged
    }

    async updateTpuTokens(_id, access_token, refresh_token) {
        const query = await this.userModel.updateOne({
            _id: _id
        },
            {
                $set: {
                    access_token: access_token,
                    refresh_token: refresh_token
                }
            }).exec()

        console.log(`UsersRepository: updateTpuTokens(): ${query.acknowledged}`)
        return query.acknowledged
    }

    async getTelegramChatIds() {
        const chatIds = await this.userModel.find({}, {
            _id: 0,
            telegram_chat_id: 1
        })

        return chatIds
    }
}