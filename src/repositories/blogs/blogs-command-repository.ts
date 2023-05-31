import {BlogsModelClass} from "../../models/blog/BlogsModelClass";
import {BlogDTO} from "../../domain/dtos";

export class BlogsCommandRepository {
    async createBlog(newBlog: BlogDTO): Promise<string> {
        const result = await new BlogsModelClass(newBlog).save();

        return result._id.toString();
    }
    async deleteBlogById(blogId: string): Promise<boolean> {
        const blogInstances = await BlogsModelClass.findById(blogId);
        if (!blogInstances) return false;

        try {
            const result = await blogInstances.deleteOne();
            return result.$isDeleted();
        } catch(e) {
            return false;
        }
    }
    async updateBlog(blogId: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        const blogInstances = await BlogsModelClass.findById(blogId);
        if (!blogInstances) return false;

        blogInstances.name = name;
        blogInstances.description = description;
        blogInstances.websiteUrl = websiteUrl;

        try {
            await blogInstances.save();
            return true;
        } catch(e) {
            return false;
        }
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
