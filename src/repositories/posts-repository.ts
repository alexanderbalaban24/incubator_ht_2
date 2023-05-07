import {postsCollections} from "../db/collections/postsCollections";
import {blogsCollections} from "../db/collections/blogsCollections";
import {Post} from "../domain/posts-services";

export const postsRepository = {
    async createPost(newPost: Post): Promise<string> {
        await postsCollections.insertOne(newPost);
        return newPost.id;
    },
    async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const blog = await blogsCollections.findOne({id: blogId});
        if (!blog) return false;

        const result = await postsCollections.updateOne({id: postId}, {
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
        const result = await postsCollections.deleteOne({id: postId});

        return result.deletedCount === 1;
    }
}