import mongoose, {Model} from "mongoose";
import {queryHelper} from "../../shared/helpers";
import {QueryCustomMethods} from "../../shared/types";

export type BlogDB = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export const BlogsSchema = new mongoose.Schema<BlogDB, Model<BlogDB, QueryCustomMethods>, {}, QueryCustomMethods>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    isMembership: {type: Boolean, required: true, default: false}
}, {timestamps: true, query: queryHelper});

export const BlogsModelClass = mongoose.model<BlogDB, Model<BlogDB, QueryCustomMethods>>("blogs", BlogsSchema);
