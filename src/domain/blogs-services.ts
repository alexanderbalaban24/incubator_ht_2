import {BlogsCommandRepository} from "../repositories/blogs/blogs-command-repository";
import {BlogDTO} from "./dtos";
import {ResultDTO} from "../shared/dto";
import {InternalCode} from "../shared/enums";

export class BlogsServices {

    constructor(protected blogsCommandRepository: BlogsCommandRepository){}
    async createBlog(name: string, description: string, websiteUrl: string): Promise<ResultDTO<{id: string} | null>> {
        const newBlog = new BlogDTO(name, description, websiteUrl);
        const blogResult = await this.blogsCommandRepository.createBlog(newBlog);

        if(blogResult.success) {
            return new ResultDTO(InternalCode.Created, blogResult.payload);
        } else {
            return new ResultDTO(InternalCode.Server_Error);
        }
    }
    async deleteBlogById(blogId: string): Promise<ResultDTO<{ isDeleted: boolean }>> {
        const deletedResult =  await this.blogsCommandRepository.deleteBlogById(blogId);

        if(deletedResult.success) {
            return new ResultDTO(InternalCode.No_Content, deletedResult.payload);
        } else {
            return new ResultDTO(deletedResult.code);
        }
    }
    async updateBlog(blogId: string, name: string, description: string, websiteUrl: string): Promise<ResultDTO<{isUpdate: boolean}>> {
        const updateResult = await this.blogsCommandRepository.updateBlog(blogId, name, description, websiteUrl);

        if(updateResult.success) {
            return new ResultDTO(InternalCode.No_Content, updateResult.payload);
        } else {
            return new ResultDTO(updateResult.code);
        }
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
