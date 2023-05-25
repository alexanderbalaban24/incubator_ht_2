import {Blog} from "../../domain/blogs-services";
import {ObjectId} from "mongodb";
import {BlogsModel} from "../../db";

export const blogsCommandRepository = {
    async createBlog(newBlog: Blog): Promise<string> {
        const result = await new BlogsModel(newBlog).save();

        return result._id.toString();
    },
    async deleteBlogById(blogId: string): Promise<boolean> {
        const result = await BlogsModel.deleteOne({_id: new ObjectId(blogId)});

        return result.deletedCount === 1;
    },
    async updateBlog(blogId: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        const result = await BlogsModel.updateOne({_id: new ObjectId(blogId)}, {$set: {name, description, websiteUrl}});

        return result.matchedCount === 1;
    }


}