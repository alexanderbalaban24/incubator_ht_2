import {Post} from "../../domain/posts-services";
import {BlogsModelClass, PostsModelClass} from "../../db";

export class PostsCommandRepository {
    async createPost(newPost: Post): Promise<string> {
        const result = await new PostsModelClass(newPost).save();
        return result._id.toString();
    }
    async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string, blogName: string): Promise<boolean> {
        const postInstances = await PostsModelClass.findById(postId);
        if (!postInstances) return false;

        postInstances.title = title;
        postInstances.shortDescription = shortDescription;
        postInstances.content = content;
        postInstances.blogId = blogId;
        postInstances.blogName = blogName;

        try {
            await postInstances.save();
            return true;
        } catch (e) {
            return false;
        }
    }
    async deletePostById(postId: string): Promise<boolean> {
        const postInstances = await PostsModelClass.findById(postId);
        if (!postInstances) return false;

        try {
            const result = await postInstances.deleteOne();
            return result.$isDeleted();
        } catch (e) {
            return false;
        }
    }
}