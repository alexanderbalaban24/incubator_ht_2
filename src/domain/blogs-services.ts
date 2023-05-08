import {blogsCommandRepository} from "../repositories/blogs/blogs-command-repository";

export type Blog = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export const blogsServices = {
    async createBlog(name: string, description: string, websiteUrl: string): Promise<string> {
        const newBlog: Blog = {
            id: new Date().toISOString(),
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
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