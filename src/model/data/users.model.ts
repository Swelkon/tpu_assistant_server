import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose"

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({required: true})
    user_id: number;

    @Prop({required: false})
    lichnost_id: number;

    @Prop({required: true})
    email: string;

    @Prop({required: true})
    first_name: string;

    @Prop({required: true})
    last_name: string;

    @Prop({required: true})
    telegram_chat_id: number;

    @Prop({required: true})
    access_token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);