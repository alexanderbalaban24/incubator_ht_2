export type UsersDB = {
    login: string
    email: string
    passwordHash: string
    createdAt: string
    emailConfirmation: EmailConfirmation
}

type EmailConfirmation = {
    confirmationCode: string
    expirationDate: string
    isConfirmed: boolean
}