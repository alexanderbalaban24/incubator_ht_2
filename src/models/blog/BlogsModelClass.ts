import mongoose from "mongoose";
import {WithId} from "mongodb";

export type BlogDB = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export const BlogsSchema = new mongoose.Schema<BlogDB>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    isMembership: {type: Boolean, required: true, default: false}
}, {timestamps: true});

export const BlogsModelClass = mongoose.model<BlogDB>("blogs", BlogsSchema);
