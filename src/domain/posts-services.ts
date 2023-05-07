import {postsRepository} from "../repositories/posts-repository";
import {blogsRepository} from "../repositories/blogs-repository";

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
    async findPost(): Promise<Post[]> {
        return await postsRepository.findPost();
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string) {
        const blog = await blogsRepository.findBlogById(blogId);
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

        return await postsRepository.createPost(newPost);

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