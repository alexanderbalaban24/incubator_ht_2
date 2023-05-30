export type UsersDB = {
    login: string
    email: string
    passwordHash: string
    createdAt: string
    emailConfirmation: EmailConfirmation
    passwordRecover: PasswordRecover
}

type EmailConfirmation = {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}

type PasswordRecover = {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}