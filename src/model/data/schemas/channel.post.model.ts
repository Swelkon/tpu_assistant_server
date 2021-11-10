import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

export type ChannelPostDocument = ChannelPost & Document;

@Schema()
export class ChannelPost{
    @Prop({required: true})
    from_chat_id: number

    @Prop({required: true})
    message_id: number

    @Prop({required: true})
    date: number

    @Prop({required: true})
    is_poll: boolean
}

export const ChannelPostSchema = SchemaFactory.createForClass(ChannelPost)