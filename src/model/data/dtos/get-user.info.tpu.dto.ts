export class GetUserInfoTpuDto {
    "studies": Array<UserInfoTpu>
    "message": string
    "code": number
}

export class UserInfoTpu {
    gruppa: string
    gradebook_number: string
    department: string
    status: string
    direction_of_training: string
    form_of_education: string
    type_of_financing: string
}