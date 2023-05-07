import {blogsCollections} from "../db/collections/blogsCollections";
import {Blog} from "../domain/blogs-services";

export const blogsRepository = {
    async findBlogs(): Promise<Blog[]> {
        return await blogsCollections.find({}, {projection: {_id: 0}}).toArray();
    },
    async createBlog(newBlog: Blog): Promise<Blog> {
        await blogsCollections.insertOne(newBlog);

        const createdBlog: Blog = {
            id: newBlog.id,
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership
        }
        return createdBlog;
    },
    async findBlogById(blogId: string): Promise<Blog | null> {
        return await blogsCollections.findOne({id: blogId}, {projection: {_id: 0}});
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