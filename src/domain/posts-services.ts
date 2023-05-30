import {blogsQueryRepository} from "../composition-root";
import {PostsCommandRepository} from "../repositories/posts/posts-command-repository";

export type Post = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}

export class PostsServices {

    constructor(protected postsCommandRepository: PostsCommandRepository){}
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

        return await this.postsCommandRepository.createPost(newPost);

    }
    async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const blog = await blogsQueryRepository.findBlogById(blogId);
        if (!blog) return false;

        return await this.postsCommandRepository.updatePost(postId, title, shortDescription, content, blogId, blog.name);
    }
    async deletePostById(postId: string): Promise<boolean> {
        return await this.postsCommandRepository.deletePostById(postId);
    }
}