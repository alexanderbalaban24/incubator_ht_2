import mongoose, {HydratedDocument, Model} from "mongoose";
import {queryHelper} from "../../shared/helpers";
import {QueryCustomMethods} from "../../shared/types";
import {BlogDTO} from "../../domain/dtos";

export type BlogDB = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

type BlogModelStaticType = Model<BlogDB, QueryCustomMethods, {}> & {
    makeInstance(name: string, description: string, websiteUrl: string): HydratedDocument<BlogDB>;
}

export const BlogsSchema = new mongoose.Schema<BlogDB, BlogModelStaticType, {}, QueryCustomMethods>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    isMembership: {type: Boolean, required: true, default: false}
}, {timestamps: true, query: queryHelper});

BlogsSchema.static("makeInstance", function (name: string, description: string, websiteUrl: string) {
    const newBlog = new BlogDTO(name, description, websiteUrl);
    return new this(newBlog);
});

export const BlogsModelClass = mongoose.model<BlogDB, BlogModelStaticType, QueryCustomMethods>("blogs", BlogsSchema);
