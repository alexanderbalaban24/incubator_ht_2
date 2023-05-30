import {BlogsCommandRepository} from "../repositories/blogs/blogs-command-repository";

export type Blog = {
    name: string
    description: string
    websiteUrl: string
}

export class BlogsServices {

    constructor(protected blogsCommandRepository: BlogsCommandRepository){}
    async createBlog(name: string, description: string, websiteUrl: string): Promise<string> {
        const newBlog: Blog = {
            name,
            description,
            websiteUrl
        }
        return await this.blogsCommandRepository.createBlog(newBlog);
    }
    async deleteBlogById(blogId: string): Promise<boolean> {
        return await this.blogsCommandRepository.deleteBlogById(blogId);
    }
    async updateBlog(blogId: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        return await this.blogsCommandRepository.updateBlog(blogId, name, description, websiteUrl);
    }


}