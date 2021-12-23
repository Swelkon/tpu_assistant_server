export class TpuDataDto<T> {
    data: T
    access_token: string
    refresh_token: string

    constructor(data: T, access_token: string, refresh_token: string) {
        this.data = data
        this.access_token = access_token
        this.refresh_token = refresh_token
    }
}
