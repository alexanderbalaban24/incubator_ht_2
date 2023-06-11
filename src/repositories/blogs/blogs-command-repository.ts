import {BlogDB, BlogsModelClass} from "../../models/database/BlogsModelClass";
import {BlogDTO} from "../../domain/dtos";
import {ResultDTO} from "../../shared/dto";
import {InternalCode} from "../../shared/enums";
import {injectable} from "inversify";
import {HydratedDocument} from "mongoose";

@injectable()
export class BlogsCommandRepository {
    async findBlogById(blogId: string): Promise<ResultDTO<HydratedDocument<BlogDB>>> {
        const blogInstance = await BlogsModelClass.findById(blogId);
        if (!blogInstance) return new ResultDTO(InternalCode.Not_Found);

        return new ResultDTO(InternalCode.Success, blogInstance);
    }

    async createBlog(newBlog: BlogDTO): Promise<ResultDTO<{ id: string }>> {
        const result = await new BlogsModelClass(newBlog).save();

        return new ResultDTO(InternalCode.Success, {id: result._id.toString()});
    }

    async deleteBlogById(blogId: string): Promise<ResultDTO<{ isDeleted: boolean }>> {
        const blogInstances = await BlogsModelClass.findById(blogId);
        if (!blogInstances) return new ResultDTO(InternalCode.Not_Found);

        const result = await blogInstances.deleteOne();
        const isDeleted = result.$isDeleted();
        if (!isDeleted) return new ResultDTO(InternalCode.Server_Error);

        return new ResultDTO(InternalCode.Success, {isDeleted});
    }

    async updateBlog(blogId: string, name: string, description: string, websiteUrl: string): Promise<ResultDTO<{
        isUpdate: boolean
    }>> {
        const blogInstances = await BlogsModelClass.findById(blogId);
        if (!blogInstances) return new ResultDTO(InternalCode.Not_Found);

        blogInstances.name = name;
        blogInstances.description = description;
        blogInstances.websiteUrl = websiteUrl;

        await blogInstances.save();

        return new ResultDTO(InternalCode.Success, {isUpdate: true});
    }

    async save(blog: HydratedDocument<BlogDB>): Promise<ResultDTO<{ id: string }>> {
        const result = await blog.save();

        return new ResultDTO(InternalCode.Success, {id: result._id.toString()})
    }
}
