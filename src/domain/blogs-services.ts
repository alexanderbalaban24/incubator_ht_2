import {blogsRepository} from "../repositories/blogs-repository";

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
        return await blogsRepository.createBlog(newBlog);
    },
    async deleteBlogById(blogId: string): Promise<boolean> {
        return await blogsRepository.deleteBlogById(blogId);
    },
    async updateBlog(blogId: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        return await blogsRepository.updateBlog(blogId, name, description, websiteUrl);
    }


}