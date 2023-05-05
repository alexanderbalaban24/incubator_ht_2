import {Post} from "../models/post/Post";
import {BlogType, PostType} from "../shared/types";
import {postsCollections} from "../db/collections/postsCollections";
import {blogsCollections} from "../db/collections/blogsCollections";

export const postsRepository = {
    async findPost() {
        return await postsCollections.find<PostType>({}, {projection: {_id: 0}}).toArray();
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string) {
        const blog: BlogType | null = await blogsCollections.findOne({id: blogId}, {projection: {_id: 0}});

        if (blog) {
            const newPost = new Post(title, shortDescription, content, blogId, blog.name);
            await postsCollections.insertOne({...newPost});
            return newPost;
        } else {
            return null;
        }
    },
    async findPostById(postId: string) {
        const post = await postsCollections.findOne<PostType>({id: postId}, {projection: {_id: 0}});

        if (post) {
            return post;
        } else {
            return null;
        }
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