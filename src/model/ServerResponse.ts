import {User} from "./data/users.model";


export class ServerResponse<T>{
    static STATUS_OK = 0
    static STATUS_QUERY_PARAMS_NOT_GIVEN = 1
    static STATUS_USER_NOT_FOUND = 2
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
        return new ServerResponse(ServerResponse.STATUS_QUERY_PARAMS_NOT_GIVEN, "Query params 'code' or 'state' not provided", null)
    }

    public static sendUserNotFount(){
        return new ServerResponse(ServerResponse.STATUS_USER_NOT_FOUND, "User doesn't exist", null)
    }

    public static sendUserNotFromTPU(){
        return new ServerResponse(ServerResponse.STATUS_USER_NOT_FOUND, "User is not from TPU", null)
    }


    public static sendServerError(e){
        return new ServerResponse(ServerResponse.STATUS_SERVER_ERROR, `Server error occurred\n${e}`, null)
    }

    public static sendTestResponse(msg){
        return new ServerResponse(ServerResponse.STATUS_OK, msg.toString(), null)
    }
}
