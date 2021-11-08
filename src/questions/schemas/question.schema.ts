import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

export type QuestionDocument = Question & Document

@Schema()
export class Question {
    @Prop({ type: String, required: true })
    question: string

    @Prop({ type: Number, required: true })
    from_id: number

    @Prop({ type: Number, required: true })
    chat_id: number

    @Prop({ type: String, required: true })
    recepient: string
}

export const QuestionSchema = SchemaFactory.createForClass(Question)
