import {client} from "../index";
import {ObjectId, OptionalId} from "mongodb";

export type UsersDB = {
    login: string
    email: string
    passwordHash: string
    createdAt: string
    _id: ObjectId
}

export const usersCollections = client.db().collection<OptionalId<UsersDB>>("users");