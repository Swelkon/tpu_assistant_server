export class ChannelPostDto {
    from_chat_id: number
    message_id: number
    date: number
    is_poll: boolean

    constructor(from_chat_id: number, message_id: number, date: number, is_poll: boolean) {
        this.from_chat_id = from_chat_id
        this.message_id = message_id
        this.date = date
        this.is_poll = is_poll
    }
}