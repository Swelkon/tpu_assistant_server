import {HttpService} from "@nestjs/axios";
import {TpuDataDto} from "../users/dtos/tpu.data.dto";
import {TpuAuthDto} from "../users/dtos/tpu.auth.dto";
import {StudentInfoTpu, TpuStudentInfoDto} from "../users/dtos/tpu.student.info.dto";
import {TpuUserTokensDto} from "../users/dtos/tpu.user.tokens.dto";
import {TpuRoleDto} from "../users/dtos/tpu.role.dto";
import {TpuUser} from "../users/dtos/tpu.user";

// require('dotenv/config')

// Класс для работы с API ТПУ
export class ApiTPU {

    private httpService: HttpService;
    private CLIENT_ID = process.env.CLIENT_ID;
    private CLIENT_SECRET = process.env.CLIENT_SECRET;
    private BASE_URL = process.env.BASE_URL;
    private REDIRECT_URL = `${this.BASE_URL}/users/register`;
    private API_KEY = process.env.API_KEY;

    constructor(httpService: HttpService) {
        this.httpService = httpService;
    }

    // Метод для получения базовой информации юзера через access_token
    public async getUserTPU(code: string): Promise<{ access_token: any; refresh_token: any; data: TpuUser }> {

        try {
            // Получение access_token с https://oauth.tpu.ru/access_token
            const accessTokenObservable = await this.httpService.get(`https://oauth.tpu.ru/access_token?client_id=${this.CLIENT_ID}&client_secret=${this.CLIENT_SECRET}&redirect_uri=${this.REDIRECT_URL}&code=${code}&grant_type=authorization_code`);
            const response = await accessTokenObservable.toPromise();
            console.log("ApiTPU/getUserTpu: tpu user access_token response:", response.data)

            const access_token = response.data.access_token;
            const refresh_token = response.data.refresh_token;

            // Получение базовой информации пользователя с https://api.tpu.ru/v2/auth/user
            const authDataObservable = await this.httpService.get(`https://api.tpu.ru/v2/auth/user?access_token=${access_token}&apiKey=${this.API_KEY}`);
            const authDataResponse = await authDataObservable.toPromise()
            const authData: TpuAuthDto = authDataResponse.data;
            console.log("ApiTPU/getUserTpu: tpu user basic info response:", authData)

            // Получение информации о роли пользователя (студент, сотрудник) с https://api.tpu.ru/v2/lichnost/role
            const roleDataObservable = await this.httpService.get(`https://api.tpu.ru/v2/lichnost/role?access_token=${access_token}&apiKey=${this.API_KEY}`)
            const roleDataResponse = await roleDataObservable.toPromise()
            const roleData: TpuRoleDto = roleDataResponse.data
            console.log("ApiTPU/getUserTpu: role response:", roleData)

            const is_student = roleData.roles[0].role == "Студент"

            if (authData.code == 200 && roleData.code == 200) {
                const user: TpuUser = {
                    user_id: authData.user_id,
                    lichnost_id: authData.lichnost_id,
                    imya: authData.lichnost.imya,
                    familiya: authData.lichnost.familiya,
                    email: authData.email,
                    is_student: is_student
                }

                console.log("ApiTPU/getUserTpu: built user: user")

                return {
                    data: user,
                    access_token: access_token,
                    refresh_token: refresh_token
                }
            }

            return null

        } catch (e) {
            console.log("ApiTPU/getUserTpu: Error:", e)
            return null
        }
    }

    // Метод для получения дополнительной информации юзера (а именно студента)
    public async getStudentInfo(access_token: string, refresh_token: string): Promise<{ access_token: string; refresh_token: string; data: StudentInfoTpu }>{
        try {

            // Получение информации о студенте с https://api.tpu.ru/v2/student/info
            const studentInfoObservable = await this.httpService.get(`https://api.tpu.ru/v2/student/info?access_token=${access_token}&apiKey=${this.API_KEY}`)
            const studentInfoResponse = await studentInfoObservable.toPromise()
            const studentInfo: TpuStudentInfoDto = studentInfoResponse.data
            console.log("ApiTPU/getStudentInfo: tpu student info response:", studentInfo)

            if (studentInfo.code == 200) {
                return {
                    data: studentInfo.studies[0],
                    access_token: access_token,
                    refresh_token: refresh_token
                }
            }

            return null
        } catch (e) {
            console.log("ApiTPU/getStudentInfo: Error:", e)
            return null
        }
    }

    // Метод для получения расписания с https://api.tpu.ru/v2/rasp/event
    public async getTimetableTPU(access_token: string, refresh_token: string): Promise<TpuDataDto<any>> {
        try {
            // Проверка валидности токена
            const tokens = await this.getTokenTpu(access_token, refresh_token)

            if (!tokens) {
                return null
            }

            // Получение расписания с обновленными токенами
            const timetableObservable = await this.httpService.get(`https://api.tpu.ru/v2/rasp/event?access_token=${tokens.access_token}&apiKey=${this.API_KEY}`)
            const timetableResponse = await timetableObservable.toPromise()
            const timetable = timetableResponse.data
            console.log("ApiTPU/getTimetableTPU: timetable response:", timetable)

            if (timetable.code == 200) {
                return {
                    data: timetable,
                    access_token: tokens.access_token,
                    refresh_token: tokens.refresh_token
                }
            }

            return null

        } catch (e) {
            console.log("ApiTPU/getTimetableTPU: Error:", e)
            return null
        }
    }

    // Метод для получения и обновления токенов
    private async getTokenTpu(access_token: string, refresh_token: string): Promise<TpuUserTokensDto> {
        try {
            // Проверка валидности токена с https://api.tpu.ru/v2/auth/token
            const checkTokenObservable = await this.httpService.get(`https://api.tpu.ru/v2/auth/token?apiKey=${this.API_KEY}&access_token=${access_token}`)
            const checkTokenResponse = await checkTokenObservable.toPromise()
            const checkToken = checkTokenResponse.data
            console.log("ApiTPU/getTokenTpu: checkToken response:", checkToken)

            if (checkToken.code == 200) {
                const newAccessToken = checkToken.body.token
                const newRefreshToken = checkToken.body.refresh_token
                const newTokens: TpuUserTokensDto = {access_token: newAccessToken, refresh_token: newRefreshToken}
                return newTokens
            }

            // Обновление токена с PUT https://api.tpu.ru/v2/auth/token
            const renewTokenObservable = await this.httpService.put(`https://api.tpu.ru/v2/auth/token?apiKey=${this.API_KEY}&access_token=${access_token}&refresh_token=${refresh_token}`)
            const renewTokenResponse = await renewTokenObservable.toPromise()
            const renewToken = renewTokenResponse.data
            console.log("ApiTPU/getTokenTpu: renewToken response:", renewToken)

            if (renewToken.code == 200) {
                const newAccessToken = renewToken.body.token
                const newRefreshToken = renewToken.body.refresh_token
                const newTokens: TpuUserTokensDto = {access_token: newAccessToken, refresh_token: newRefreshToken}
                return newTokens
            }

            return null

        } catch (e) {
            console.log("ApiTPU/getTokenTpu: Error:", e)
            return null
        }
    }



    // TODO: Не удалять. На случай, если данные о профиле нужно постоянно менять
    // // Метод для получения дополнительной информации юзера (а именно студента)
    // public async getStudentInfo(access_token: string, refresh_token: string): Promise<{ access_token: string; refresh_token: string; data: StudentInfoTpu }>{
    //     try {
    //         // Проверка валидности токена
    //         const tokens = await this.getTokenTpu(access_token, refresh_token)
    //
    //         if (!tokens) {
    //             return null
    //         }
    //
    //         // Получение информации о студенте с https://api.tpu.ru/v2/student/info
    //         const studentInfoObservable = await this.httpService.get(`https://api.tpu.ru/v2/student/info?access_token=${tokens.access_token}&apiKey=${this.API_KEY}`)
    //         const studentInfoResponse = await studentInfoObservable.toPromise()
    //         const studentInfo: TpuStudentInfoDto = studentInfoResponse.data
    //         console.log("ApiTPU/getStudentInfo: tpu student info response:", studentInfo)
    //
    //         if (studentInfo.code == 200) {
    //             return {
    //                 data: studentInfo.studies[0],
    //                 access_token: tokens.access_token,
    //                 refresh_token: tokens.refresh_token
    //             }
    //         }
    //
    //         return null
    //     } catch (e) {
    //         console.log("ApiTPU/getStudentInfo: Error:", e)
    //         return null
    //     }
    // }
}
