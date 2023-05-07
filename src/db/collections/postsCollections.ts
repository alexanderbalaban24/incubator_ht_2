import {client} from "../index";
import {ObjectId} from "mongodb";

export type PostDB = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    _id?: ObjectId
}

export const postsCollections = client.db().collection<PostDB>("products");