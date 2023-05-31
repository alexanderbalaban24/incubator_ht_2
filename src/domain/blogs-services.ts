import {BlogsCommandRepository} from "../repositories/blogs/blogs-command-repository";
import {BlogDTO} from "./dtos";

export class BlogsServices {

    constructor(protected blogsCommandRepository: BlogsCommandRepository){}
    async createBlog(name: string, description: string, websiteUrl: string): Promise<string> {
        const newBlog = new BlogDTO(name, description, websiteUrl);
        return await this.blogsCommandRepository.createBlog(newBlog);
    }
    async deleteBlogById(blogId: string): Promise<boolean> {
        return await this.blogsCommandRepository.deleteBlogById(blogId);
    }
    async updateBlog(blogId: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        return await this.blogsCommandRepository.updateBlog(blogId, name, description, websiteUrl);
    }


}

/*
async updateBlog(blogId: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
    const blogInstances = await this.blogsCommandRepository.getBlogById(blogId)
    if (!blogInstances) throw new Error('')


blogInstances.name = name;
blogInstances.description = description;
blogInstances.websiteUrl = websiteUrl;

await this.blogsCommandRepository.save(blogInstances);

return true;

}*/
