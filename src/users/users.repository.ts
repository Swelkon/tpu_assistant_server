import {Injectable} from "@nestjs/common";
import {InjectModel, Prop} from "@nestjs/mongoose";
import {User, UserDocument} from "./schemas/users.model";
import {Model} from "mongoose";
import {TpuUser} from "./dtos/tpu.user";

Injectable()
export class UsersRepository{

    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }

    // Метод для сохранения данных пользователя в базе данных
    async saveUser(chat_id: number, access_token: string, refresh_token: string,
                   telegram_token: string, expiration: Date,
                   user_tpu: TpuUser) {
        const newUser = new this.userModel({
            user_id: user_tpu.user_id,
            lichnost_id: user_tpu.lichnost_id,
            email: user_tpu.email,
            first_name: user_tpu.imya,
            last_name: user_tpu.familiya,
            telegram_chat_id: chat_id,
            is_student: user_tpu.is_student,
            access_token: access_token,
            refresh_token: refresh_token,
            telegram_token: telegram_token,
            telegram_token_expiration_date: expiration
        });

        const result = await newUser.save();
        console.log("UserRepository/saveUser: result:", result)
        return result
    }

    // Метод для обновления данных пользователя в базе данных
    async updateUser(chat_id: number, access_token: string, refresh_token: string,
                     telegram_token: string, expiration: Date,
                     user_tpu: TpuUser) {
        const updatedUser = await this.userModel.updateOne({
                telegram_chat_id: chat_id
            },
            {
                $set: {
                    user_id: user_tpu.user_id,
                    lichnost_id: user_tpu.lichnost_id,
                    email: user_tpu.email,
                    first_name: user_tpu.imya,
                    last_name: user_tpu.familiya,
                    telegram_chat_id: chat_id,
                    is_student: user_tpu.is_student,
                    access_token: access_token,
                    refresh_token: refresh_token,
                    telegram_token: telegram_token,
                    telegram_token_expiration_date: expiration
                }
            }).exec()

        console.log("UserRepository/updateUser: updatedUser.acknowledged:", updatedUser.acknowledged)
        return updatedUser.acknowledged
    }

    // Метод для авторизации пользователя
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
                'is_student': 1,
            }
        )
            .exec()

        console.log("UsersRepository/authorizeUser: user", user)
        return user
    }

    // Метод для поиска пользователя по chat_id телеграм чата
    async findUserByChatId(chat_id: number) {
        const user = await this.userModel.findOne({telegram_chat_id: chat_id}, {
                '_id': 1,
                'telegram_chat_id': 1,
                'telegram_token': 1,
                'telegram_token_expiration_date': 1
            }
        )
            .exec()

        console.log("UsersRepository/findUserByChatId: user:", user)
        return user
    }

    // Метод для поиска access_token и refresh_token пользователя
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

        console.log("UsersRepository/findTpuTokens: query", query)
        return query
    }


    // Метод для обновления access_token и refresh_token пользователя
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

        console.log("UsersRepository/updateTpuTokens: acknowledged", query.acknowledged)
        return query.acknowledged
    }

    // Метод для получения всех chat_id всех пользователей
    async getTelegramChatIds() {
        const chatIds = await this.userModel.find({}, {
            _id: 0,
            telegram_chat_id: 1
        })

        console.log("UsersRepository/getTelegramChatIds: chatIds:", chatIds)
        return chatIds
    }

    // Метод для получения роли пользователя
    async confirmStudentRole(_id) {
        const query = this.userModel.findOne({
            _id: _id
        }, {
            '_id': 1,
            'is_student': 1
        })
            .exec()

        console.log("UsersRepository/confirmStudentRole: query", query)
        return query;
    }
}