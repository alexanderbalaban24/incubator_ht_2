import {blogsCollections} from "../../db/collections/blogsCollections";
import {Blog} from "../../domain/blogs-services";
import {ObjectId} from "mongodb";

export const blogsCommandRepository = {
    async createBlog(newBlog: Blog): Promise<string> {
        const result = await blogsCollections.insertOne(newBlog);

        return result.insertedId.toString();
    },
    async deleteBlogById(blogId: string): Promise<boolean> {
        const result = await blogsCollections.deleteOne({_id: new ObjectId(blogId)});

        return result.deletedCount === 1;
    },
    async updateBlog(blogId: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        const result = await blogsCollections.updateOne({_id: new ObjectId(blogId)}, {$set: {name, description, websiteUrl}});

        return result.matchedCount === 1;
    }


}