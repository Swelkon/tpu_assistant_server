export class GetUserAuthTpuDto {
    user_id: number
    lichnost_id: number
    lichnost: Lichnost
    email: string
    message: string
    code: number
}

export class Lichnost{
    imya: string
    familiya: string
}