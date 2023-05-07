import {Blog} from "../models/blog/Blog";
import {blogsCollections} from "../db/collections/blogsCollections";

export const blogsRepository = {
    async findBlogs() {
        return await blogsCollections.find({}, {projection: {_id: 0}}).toArray();
    },
    async createBlog(newBlog: Blog) {
        await blogsCollections.insertOne({...newBlog});

        return newBlog;
    },
    async findBlogById(blogId: string) {
        return await blogsCollections.findOne({id: blogId}, {projection: {_id: 0}});
    },
    async deleteBlogById(blogId: string) {
        const result = await blogsCollections.deleteOne({id: blogId});

        return result.deletedCount === 1;
    },
    async updateBlog(blogId: string, name: string, description: string, websiteUrl: string) {
        const result = await blogsCollections.updateOne({id: blogId}, {$set: {name, description, websiteUrl}});

        return result.matchedCount === 1;
    }


}