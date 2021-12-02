import {HttpService} from "@nestjs/axios";
import {UserTpuDto} from "../users/dtos/user.tpu.dto";

// require('dotenv/config')

export class ApiTPU {

    private httpService: HttpService;
    private CLIENT_ID = process.env.CLIENT_ID;
    private CLIENT_SECRET = process.env.CLIENT_SECRET;
    private REDIRECT_URL = process.env.REDIRECT_URL;
    private API_KEY = process.env.API_KEY;

    constructor(httpService: HttpService) {
        this.httpService = httpService;
    }

    public async getUserTPU(code: string): Promise<UserTpuDto>{

        try {
            // Get access_token from https://oauth.tpu.ru/access_token
            const accessTokenObservable = await this.httpService.get(`https://oauth.tpu.ru/access_token?client_id=${this.CLIENT_ID}&client_secret=${this.CLIENT_SECRET}&redirect_uri=${this.REDIRECT_URL}&code=${code}&grant_type=authorization_code`);
            const response = await accessTokenObservable.toPromise();

            console.log(response.data)
            const access_token = response.data.access_token;
            const refresh_token = response.data.refresh_token;

            // Get user data from https://api.tpu.ru/v2/auth/user
            const userObservable = await this.httpService.get(`https://api.tpu.ru/v2/auth/user?access_token=${access_token}&apiKey=${this.API_KEY}`);
            const userResponse = await userObservable.toPromise()
            const user = userResponse.data;

            // Get user data from https://api.tpu.ru/v2/student/info
            const userInfoObservable = await this.httpService.get(`https://api.tpu.ru/v2/student/info?access_token=${access_token}&apiKey=${this.API_KEY}`)
            const userInfoResponse = await userInfoObservable.toPromise()
            const userInfo = userInfoResponse.data

            if (userInfo.code == 200){
                console.log("APITPU user info: ", userInfo["studies"])
                return new UserTpuDto(user, userInfo, access_token, refresh_token)
            }

            return null

        } catch (e) {
            console.log(e)
            return null
        }
    }

    public async getTimetableTPU(access_token: string, refresh_token: string) {
        try {
            const renewTokenObservable = await this.httpService.put(`https://api.tpu.ru/v2/auth/token?apiKey=${this.API_KEY}&access_token=${access_token}&refresh_token=${refresh_token}`)
            const renewTokenResponse = await renewTokenObservable.toPromise()
            const renewToken = renewTokenResponse.data

            if (renewToken.code == 200){
                const newAccessToken = renewToken.body.token
                const newRefreshToken = renewToken.body.refresh_token
                const timetableObservable = await this.httpService.get(`https://api.tpu.ru/v2/rasp/event?access_token=${access_token}&apiKey=${this.API_KEY}`)
                const timetableResponse = await timetableObservable.toPromise()
                const timetable = timetableResponse.data

                if(timetable.code !== 200){
                    return null
                }

                return {
                    timetable: timetable,
                    new_access_token: newAccessToken,
                    new_refresh_token: newRefreshToken
                }
            }

            return null

        } catch (e) {
            console.log(e)
            return null
        }
    }

}



// // Get user data from https://api.tpu.ru/v2/auth/user
// const userFullObservable = await this.httpService.get(`https://api.tpu.ru/v2/users/bbc7?access_token=${access_token}&apiKey=${api_key}`);
// const userFullResponse = await userFullObservable.toPromise()
// const userFull = userFullResponse.data;
//
// console.log(userFull)