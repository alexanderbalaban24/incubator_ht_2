import {blogsQueryRepository} from "../composition-root";
import {PostsCommandRepository} from "../repositories/posts/posts-command-repository";
import {PostDTO} from "./dtos";

export class PostsServices {

    constructor(protected postsCommandRepository: PostsCommandRepository) {
    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<string | null> {
        const blog = await blogsQueryRepository.findBlogById(blogId);
        if (!blog) return null;

        const newPost = new PostDTO(
            title,
            shortDescription,
            content,
            blogId,
            blog.name
        )

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