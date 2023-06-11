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

export interface BlogMethodType extends Document {
    changeData(name: string, description: string, websiteUrl: string): void;
}

export type BlogModelStaticType = Model<BlogDB, QueryCustomMethods, BlogMethodType> & {
    makeInstance(name: string, description: string, websiteUrl: string): HydratedDocument<BlogDB>;

}

export const BlogsSchema = new mongoose.Schema<BlogDB, BlogModelStaticType, BlogMethodType, QueryCustomMethods>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    isMembership: {type: Boolean, required: true, default: false}
}, {timestamps: true, query: queryHelper});

BlogsSchema.static("makeInstance", function (name: string, description: string, websiteUrl: string) {
    const newBlog = new BlogDTO(name, description, websiteUrl);
    return new this(newBlog);
});

BlogsSchema.method("changeData", function (name: string, description: string, websiteUrl: string) {
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
})

export const BlogsModelClass = mongoose.model<BlogDB, BlogModelStaticType, QueryCustomMethods>("blogs", BlogsSchema);
