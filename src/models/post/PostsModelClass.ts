import mongoose, {Model} from "mongoose";
import {QueryCustomMethods} from "../../shared/types";

import {queryHelper} from "../../shared/helpers";

export type PostDB = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export const PostsSchema = new mongoose.Schema<PostDB, Model<PostDB, QueryCustomMethods>, {}, QueryCustomMethods>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true}
}, {timestamps: true, query: queryHelper});

export const PostsModelClass = mongoose.model<PostDB, Model<PostDB, QueryCustomMethods>>("posts", PostsSchema);