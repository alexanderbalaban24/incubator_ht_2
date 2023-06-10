import {BlogsModelClass} from "../../models/database/BlogsModelClass";
import {BlogDTO} from "../../domain/dtos";
import {ResultDTO} from "../../shared/dto";
import {InternalCode} from "../../shared/enums";
import {injectable} from "inversify";

@injectable()
export class BlogsCommandRepository {
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

    async updateBlog(blogId: string, name: string, description: string, websiteUrl: string): Promise<ResultDTO<{isUpdate: boolean}>> {
        const blogInstances = await BlogsModelClass.findById(blogId);
        if (!blogInstances) return new ResultDTO(InternalCode.Not_Found);

        blogInstances.name = name;
        blogInstances.description = description;
        blogInstances.websiteUrl = websiteUrl;

        await blogInstances.save();

        return new ResultDTO(InternalCode.Success, {isUpdate: true});
    }
}


/*async save(blog: HydratedDocument<BlogDB>) {
        await blog.save();
    }

    async saveUser(user: UserEntity) {
        const likes = user.likes
        db.update(likes)
        await blog.save();
    }

    async getBlogById(id: string): Promise<UserEntity> {
        data = db.select()
        //mapping
        retrun new UserEntity(data)
        return BlogsModelClass.findById(id);
    } */
