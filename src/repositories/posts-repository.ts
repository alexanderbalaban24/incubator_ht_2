import {postsCollections} from "../db/collections/postsCollections";
import {blogsCollections} from "../db/collections/blogsCollections";
import {Post} from "../domain/posts-services";

export const postsRepository = {
    async findPost(): Promise<Post[]> {
        return await postsCollections.find({}, {projection: {_id: 0}}).toArray();
    },
    async createPost(newPost: Post): Promise<Post> {
            await postsCollections.insertOne({...newPost});
            return newPost;
    },
    async findPostById(postId: string): Promise<Post | null> {
        return await postsCollections.findOne({id: postId}, {projection: {_id: 0}});
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