import mongoose from "mongoose";
import {WithId} from "mongodb";

export type PostDB = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export const PostsSchema = new mongoose.Schema<PostDB>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true}
}, {timestamps: true});

export const PostsModelClass = mongoose.model<PostDB>("posts", PostsSchema);