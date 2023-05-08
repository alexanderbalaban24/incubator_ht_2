import {blogsCollections} from "../../db/collections/blogsCollections";
import {Blog} from "../../domain/blogs-services";

export const blogsCommandRepository = {
    async createBlog(newBlog: Blog): Promise<string> {
        await blogsCollections.insertOne(newBlog);

        return newBlog.id;
    },
    async deleteBlogById(blogId: string): Promise<boolean> {
        const result = await blogsCollections.deleteOne({id: blogId});

        return result.deletedCount === 1;
    },
    async updateBlog(blogId: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        const result = await blogsCollections.updateOne({id: blogId}, {$set: {name, description, websiteUrl}});

        return result.matchedCount === 1;
    }


}