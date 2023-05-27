import mongoose from "mongoose";
import {WithId} from "mongodb";
import {PostDB} from "./types";

export const PostsSchema = new mongoose.Schema<WithId<PostDB>>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true}
}, {timestamps: true});