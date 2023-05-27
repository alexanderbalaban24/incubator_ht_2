import {blogsCommandRepository} from "../repositories/blogs/blogs-command-repository";

export type Blog = {
    name: string
    description: string
    websiteUrl: string
}

export const blogsServices = {
    async createBlog(name: string, description: string, websiteUrl: string): Promise<string> {
        const newBlog: Blog = {
            name,
            description,
            websiteUrl
        }
        return await blogsCommandRepository.createBlog(newBlog);
    },
    async deleteBlogById(blogId: string): Promise<boolean> {
        return await blogsCommandRepository.deleteBlogById(blogId);
    },
    async updateBlog(blogId: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        return await blogsCommandRepository.updateBlog(blogId, name, description, websiteUrl);
    }


}