import mongoose from "mongoose";
import {WithId} from "mongodb";

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

const EmailConfirmationSchema = new mongoose.Schema<EmailConfirmation>({
    confirmationCode: {type: String, required: true},
    expirationDate: {type: Date, required: true},
    isConfirmed: {type: Boolean, required: true}
})

const PasswordRecoverSchema = new mongoose.Schema<PasswordRecover>({
    confirmationCode: {type: String, required: true},
    expirationDate: {type: Date, required: true},
    isConfirmed: {type: Boolean, required: true}
})

export const UsersSchema = new mongoose.Schema<UsersDB>({
    login: {type: String, required: true},
    email: {type: String, required: true},
    passwordHash: {type: String, required: true},
    emailConfirmation: {
        type: EmailConfirmationSchema,
        required: true
    },
    passwordRecover: {
        type: PasswordRecoverSchema,
        required: true
    }
}, {timestamps: true});

export const UsersModelClass = mongoose.model<UsersDB>("users", UsersSchema);