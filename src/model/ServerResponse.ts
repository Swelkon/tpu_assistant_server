import {User} from "../users/schemas/users.model";
import {ChannelPostDto} from "../channels/dtos/channel.post.dto";
import {ApiProperty} from "@nestjs/swagger";

export class ServerResponse<T>{
    static STATUS_OK = 200
    static STATUS_PARAMS_NOT_GIVEN = 400
    static STATUS_USER_NOT_FOUND = 404
    static STATUS_AUTH_NEEDED = 401
    static STATUS_SERVER_ERROR = 500
    @ApiProperty({ type: Number, description: 'Статус'})
    public status: number
    @ApiProperty({ type: String, description: 'Сообщение'})
    public message: string
    @ApiProperty({ type: Object, description: 'Данные'})
    public data: any

    constructor(
        status: number,
        message: string,
        data: any
    ){
        this.status = status
        this.message = message
        this.data = data
    }


    public static sendSuccessfulRegistration(){
        return new ServerResponse(ServerResponse.STATUS_OK, "Successful registration", null)
    }

    public static sendSuccessfulUpdate(){
        return new ServerResponse(ServerResponse.STATUS_OK, "Successful update", null)
    }

    public static sendUserData(userData: User){
        return new ServerResponse(ServerResponse.STATUS_OK, "Successful authorization", userData)
    }

    public static sendCodeOrStateNotGiven(){
        return new ServerResponse(ServerResponse.STATUS_PARAMS_NOT_GIVEN, "Query params 'code' or 'state' not provided", null)
    }

    public static sendUserNotFount(){
        return new ServerResponse(ServerResponse.STATUS_USER_NOT_FOUND, "User doesn't exist", null)
    }


    public static sendAuthIsNeeded(){
        return new ServerResponse(ServerResponse.STATUS_AUTH_NEEDED, "Unauthorized via TPU", null)
    }

    public static sendServerError(e){
        return new ServerResponse(ServerResponse.STATUS_SERVER_ERROR, `Server error occurred\n${e}`, null)
    }

    public static sendPostCreated(post: ChannelPostDto){
        return new ServerResponse<ChannelPostDto>(ServerResponse.STATUS_OK, "Post saved", post)
    }

    public static sendPostFailed(){
        return new ServerResponse(ServerResponse.STATUS_SERVER_ERROR, "Post hasn't been saved", null)
    }

    public static sendPostsRetrieved(testPosts){
        return new ServerResponse(ServerResponse.STATUS_OK, "Posts have been retrieved", testPosts)
    }

    public static sendRaspSuccess(lessons){
        return new ServerResponse(ServerResponse.STATUS_OK, "Retrieved timetable", lessons)
    }


    public static sendTelegramIds(telegramChatIds){
        return new ServerResponse(ServerResponse.STATUS_OK, "Telegram chat ids retrieved successfully", telegramChatIds)
    }
    public static sendCouldNotRetrieveTelegramIds(){
        return new ServerResponse(ServerResponse.STATUS_SERVER_ERROR, "Telegram chat ids not retrieved", null)
    }

    static sendServerFail() {
        return new ServerResponse(ServerResponse.STATUS_SERVER_ERROR, "Failed to retrieve answer", null);
    }

    static sendFAQAnswer(answer) {
        return new ServerResponse(ServerResponse.STATUS_OK, "Answer retrieved successfully", answer);
    }
}
