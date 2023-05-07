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
    async findBlogs(): Promise<Blog[]> {
        return await blogsRepository.findBlogs();
    },
    async createBlog(name: string, description: string, websiteUrl: string): Promise<Blog> {
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
    async findBlogById(blogId: string): Promise<Blog | null> {
        return await blogsRepository.findBlogById(blogId);
    },
    async deleteBlogById(blogId: string): Promise<boolean> {
        return await blogsRepository.deleteBlogById(blogId);
    },
    async updateBlog(blogId: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        return await blogsRepository.updateBlog(blogId, name, description, websiteUrl);
    }


}