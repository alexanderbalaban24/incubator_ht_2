import {Post} from "../../domain/posts-services";
import {ObjectId} from "mongodb";
import {BlogsModel, PostsModel} from "../../db";

export const postsCommandRepository = {
    async createPost(newPost: Post): Promise<string> {
        const result = await new PostsModel(newPost).save();
        return result._id.toString();
    },
    async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const blog = await BlogsModel.findOne({_id: new ObjectId(blogId)});
        if (!blog) return false;

        const result = await PostsModel.updateOne({_id: new ObjectId(postId)}, {
            $set: {
                title,
                shortDescription,
                content,
                blogId
            }
        });

        return result.matchedCount === 1;
    },
    async deletePostById(postId: string): Promise<boolean> {
        const result = await PostsModel.deleteOne({_id: new ObjectId(postId)});

        return result.deletedCount === 1;
    }
}