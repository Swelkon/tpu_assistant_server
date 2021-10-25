import {User} from "../users/users.model";
import {constans} from "./constants";


export class ServerResponse<T>{
    constructor(
        public status: number,
        public message: string,
        public data: any
    ){ }

    public static sendUserData(userData: User){
        return new ServerResponse(constans.OK, "Successful authorization", userData)
    }

    public static sendUserNotFount(){
        return new ServerResponse(constans.NOT_FOUND, "User doesn't exist", null)
    }


    public static sendServerError(){
        return new ServerResponse(constans.SERVER_ERROR, "Server error occurred", null)
    }
}
