export type ConfirmationDataType = {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}

export type UserInfoType = {
    id: string,
    passwordHash: string
}
