import {GetUserAuthTpuDto} from "./get-user.auth.tpu.dto";
import {GetUserInfoTpuDto} from "./get-user.info.tpu.dto";

export class UserTpuDto {
    user_auth: GetUserAuthTpuDto
    user_info: GetUserInfoTpuDto
    access_token: string
    refresh_token: string

    constructor(user_auth: GetUserAuthTpuDto, user_info: GetUserInfoTpuDto, access_token: string, refresh_token: string) {
        this.user_auth = user_auth
        this.user_info = user_info
        this.access_token = access_token
        this.refresh_token = refresh_token
    }
}