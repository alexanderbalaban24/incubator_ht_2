import {Post} from "../models/post/Post";
import {BlogType} from "../shared/types";
import {postsRepository} from "../repositories/posts-repository";
import {blogsRepository} from "../repositories/blogs-repository";

export const postsServices = {
    async findPost() {
        return await postsRepository.findPost();
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string) {
        const blog: BlogType | null = await blogsRepository.findBlogById(blogId);

        if (blog) {
            return await postsRepository.createPost(new Post(title, shortDescription, content, blogId, blog.name));
        } else {
            return null;
        }
    },
    async findPostById(postId: string) {
        return await postsRepository.findPostById(postId);
    },
    async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string) {
        const blog = await blogsRepository.findBlogById(blogId);
        if (!blog) return false;

        return await postsRepository.updatePost(postId, title, shortDescription, content, blogId);
    },
    async deletePostById(postId: string) {
        return await postsRepository.deletePostById(postId);
    }
}