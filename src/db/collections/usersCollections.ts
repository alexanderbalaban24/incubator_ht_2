import {client} from "../index";
import {ObjectId} from "mongodb";

export type UsersDB = {
    id: string
    login: string
    email: string
    passwordHash: string
    createdAt: string
    _id?: ObjectId
}

export const usersCollections = client.db().collection<UsersDB>("users");