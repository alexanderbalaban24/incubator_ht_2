import {BlogsCommandRepository} from "../repositories/blogs/blogs-command-repository";
import {ResultDTO} from "../shared/dto";
import {InternalCode} from "../shared/enums";
import {inject, injectable} from "inversify";
import {BlogsModelClass} from "../models/database/BlogsModelClass";

@injectable()
export class BlogsServices {

    constructor(@inject(BlogsCommandRepository) protected blogsCommandRepository: BlogsCommandRepository){}
    async createBlog(name: string, description: string, websiteUrl: string): Promise<ResultDTO<{id: string} | null>> {
        const newBlogInstance = BlogsModelClass.makeInstance(name, description, websiteUrl);

        return await this.blogsCommandRepository.save(newBlogInstance);
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
        const blogResult = await this.blogsCommandRepository.findBlogById(blogId);
        if(!blogResult.success) return new ResultDTO(blogResult.code);

        const blogInstance = blogResult.payload;

        blogInstance!.changeData(name, description, websiteUrl);

        const saveResult = await this.blogsCommandRepository.save(blogInstance!);

        if(saveResult.success) {
            return new ResultDTO(saveResult.code, {isUpdate: true});
        } else {
            return new ResultDTO(saveResult.code);
        }
    }


}