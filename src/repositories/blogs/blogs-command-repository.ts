import {Blog} from "../../domain/blogs-services";
import {BlogsModelClass} from "../../db";

export const blogsCommandRepository = {
    async createBlog(newBlog: Blog): Promise<string> {
        const result = await new BlogsModelClass(newBlog).save();

        return result._id.toString();
    },
    async deleteBlogById(blogId: string): Promise<boolean> {
        const blogInstances = await BlogsModelClass.findById(blogId);
        if (!blogInstances) return false;

        try {
            const result = await blogInstances.deleteOne();
            return result.$isDeleted();
        } catch(e) {
            return false;
        }
    },
    async updateBlog(blogId: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        const blogInstances = await BlogsModelClass.findById(blogId);
        if (!blogInstances) return false;

        blogInstances.name = name;
        blogInstances.description = description;
        blogInstances.websiteUrl = websiteUrl;

        try {
            await blogInstances.save();
            return true;
        } catch(e) {
            return false;
        }
    }


}