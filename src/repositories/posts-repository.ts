import {Post} from "../models/post/Post";
import {PostType} from "../shared/types";
import {postsCollections} from "../db/collections/postsCollections";
import {blogsCollections} from "../db/collections/blogsCollections";

export const postsRepository = {
    async findPost() {
        return await postsCollections.find<PostType>({}, {projection: {_id: 0}}).toArray();
    },
    async createPost(newPost: Post) {
            await postsCollections.insertOne({...newPost});
            return newPost;
    },
    async findPostById(postId: string) {
        return await postsCollections.findOne<PostType>({id: postId}, {projection: {_id: 0}});
    },
    async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string) {
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
    async deletePostById(postId: string) {
        const result = await postsCollections.deleteOne({id: postId});

        return result.deletedCount === 1;
    }
}