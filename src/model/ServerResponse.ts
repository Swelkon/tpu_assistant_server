import {User} from "../users/schemas/users.model";
import {ChannelPostDto} from "../channels/dtos/channel.post.dto";


export class ServerResponse<T>{
    static STATUS_OK = 0
    static STATUS_PARAMS_NOT_GIVEN = 1
    static STATUS_USER_NOT_FOUND = 2
    static STATUS_AUTH_NEEDED = 401
    static STATUS_RASP_NOT_FOUND = 3
    static STATUS_SERVER_ERROR = 10

    constructor(
        public status: number,
        public message: string,
        public data: any
    ){ }


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

    public static sendUserNotFromTPU(){
        return new ServerResponse(ServerResponse.STATUS_USER_NOT_FOUND, "User is not from TPU", null)
    }

    public static sendAuthIsNeeded(){
        return new ServerResponse(ServerResponse.STATUS_AUTH_NEEDED, "Unauthorized via TPU", null)
    }

    public static sendServerError(e){
        return new ServerResponse(ServerResponse.STATUS_SERVER_ERROR, `Server error occurred\n${e}`, null)
    }

    public static sendTestResponse(msg){
        return new ServerResponse(ServerResponse.STATUS_OK, msg.toString(), null)
    }

    public static sendBodyNotProvided(){
        return new ServerResponse(ServerResponse.STATUS_PARAMS_NOT_GIVEN, "Body is not provided", null)
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

    public static sendPollsRetrieved(polls){
        return new ServerResponse(ServerResponse.STATUS_OK, "Polls have been retrieved", polls)
    }

    public static sendRaspSuccess(lessons){
        return new ServerResponse(ServerResponse.STATUS_OK, "Retrieved tiimetable", lessons)
    }

    public static sendRaspFail(){
        return new ServerResponse(ServerResponse.STATUS_RASP_NOT_FOUND, "Could not retrieve timetable ", null)
    }

    public static sendTelegramIds(telegramChatIds){
        return new ServerResponse(ServerResponse.STATUS_OK, "Telegram chat ids retrieved successfully", telegramChatIds)
    }
    public static sendCouldNotRetrieveTelegramIds(){
        return new ServerResponse(ServerResponse.STATUS_OK, "Telegram chat ids not retrieved", null)
    }
}
