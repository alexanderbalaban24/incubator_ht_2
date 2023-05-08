import {postsCommandRepository} from "../repositories/posts/posts-command-repository";
import {blogsQueryRepository} from "../repositories/blogs/blogs-query-repository";

export type Post = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export const postsServices = {
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<string | null> {
        const blog = await blogsQueryRepository.findBlogById(blogId);
        if (!blog) return null;

        const newPost: Post = {
            id: new Date().toISOString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }

        return await postsCommandRepository.createPost(newPost);

    },
    async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const blog = await blogsQueryRepository.findBlogById(blogId);
        if (!blog) return false;

        return await postsCommandRepository.updatePost(postId, title, shortDescription, content, blogId);
    },
    async deletePostById(postId: string): Promise<boolean> {
        return await postsCommandRepository.deletePostById(postId);
    }
}