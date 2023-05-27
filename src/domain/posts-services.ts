import {postsCommandRepository} from "../repositories/posts/posts-command-repository";
import {blogsQueryRepository} from "../repositories/blogs/blogs-query-repository";

export type Post = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}

export const postsServices = {
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<string | null> {
        const blog = await blogsQueryRepository.findBlogById(blogId);
        if (!blog) return null;

        const newPost: Post = {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog.name
        }

        return await postsCommandRepository.createPost(newPost);

    },
    async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const blog = await blogsQueryRepository.findBlogById(blogId);
        if (!blog) return false;

        return await postsCommandRepository.updatePost(postId, title, shortDescription, content, blogId, blog.name);
    },
    async deletePostById(postId: string): Promise<boolean> {
        return await postsCommandRepository.deletePostById(postId);
    }
}