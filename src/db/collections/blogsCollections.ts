import {client} from "../index";
import {ObjectId} from "mongodb";

export type BlogDB = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
    _id?: ObjectId
}

export const blogsCollections = client.db().collection<BlogDB>("blogs");