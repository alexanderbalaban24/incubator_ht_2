import {postsCollections} from "../../db/collections/postsCollections";
import {blogsCollections} from "../../db/collections/blogsCollections";
import {Post} from "../../domain/posts-services";
import {ObjectId} from "mongodb";

export const postsCommandRepository = {
    async createPost(newPost: Post): Promise<string> {
        const result = await postsCollections.insertOne(newPost);
        return result.insertedId.toString();
    },
    async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const blog = await blogsCollections.findOne({_id: new ObjectId(blogId)});
        if (!blog) return false;

        const result = await postsCollections.updateOne({_id: new ObjectId(postId)}, {
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
        const result = await postsCollections.deleteOne({_id: new ObjectId(postId)});

        return result.deletedCount === 1;
    }
}