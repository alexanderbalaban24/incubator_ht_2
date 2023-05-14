import {client} from "../index";
import {ObjectId, OptionalId} from "mongodb";

export type UsersDB = {
    login: string
    email: string
    passwordHash: string
    createdAt: string
    emailConfirmation: EmailConfirmation
    _id: ObjectId
}

type EmailConfirmation = {
    confirmationCode: string
    expirationDate: string
    isConfirmed: boolean
}

export const usersCollections = client.db().collection<OptionalId<UsersDB>>("users");