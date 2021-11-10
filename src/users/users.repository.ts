import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "../model/data/users.model";
import {Model} from "mongoose";

Injectable()
export class UsersRepository{

    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }

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
        return result
    }

    async authorizeUser(chat_id: number, access_token: string) {
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

        console.log(`UsersRepository: authorizeUser()\n${user}`)
        return user

    }

    async findUserByChatId(chat_id: number) {
        const user = await this.userModel.findOne({telegram_chat_id: chat_id}, {
                '_id': 0,
                'telegram_chat_id': 1,
            }
        )
            .exec()

        console.log(`UsersRepository: findUserByChatId()\n${user}`)
        return user
    }


    async updateUser(chat_id: number, access_token: string, user) {
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


        console.log(`UsersRepository: updateUser()\n${updatedUser.acknowledged}`)
        return updatedUser.acknowledged
    }
}