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
    is_student: boolean;

    // tpu access_taken
    @Prop({required: true})
    access_token: string;

    // tpu refresh_token
    @Prop({required: true})
    refresh_token: string;

    // custom token
    @Prop({required: true})
    telegram_token: string;

    @Prop({required: true})
    telegram_token_expiration_date: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);