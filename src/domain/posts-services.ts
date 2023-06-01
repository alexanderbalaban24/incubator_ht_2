import {blogsQueryRepository} from "../composition-root";
import {PostsCommandRepository} from "../repositories/posts/posts-command-repository";
import {PostDTO} from "./dtos";
import {ResultDTO} from "../shared/dto";
import {InternalCode} from "../shared/enums";

export class PostsServices {

    constructor(protected postsCommandRepository: PostsCommandRepository) {
    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<ResultDTO<{id: string}>> {
        const blogResult = await blogsQueryRepository.findBlogById(blogId);
        if (blogResult.success) {

            const newPost = new PostDTO(
                title,
                shortDescription,
                content,
                blogId,
                blogResult.payload!.name
            )

            const postResult = await this.postsCommandRepository.createPost(newPost);

            if(postResult.success) {
               return new ResultDTO(InternalCode.No_Content, postResult.payload);
            } else {
                return new ResultDTO(postResult.code);
            }
        } else {
            return new ResultDTO(InternalCode.Not_Found);
        }



    }

    async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string): Promise<ResultDTO<{isUpdate: boolean}>> {
        const blogResult = await blogsQueryRepository.findBlogById(blogId);
        if (!blogResult) return new ResultDTO(InternalCode.Not_Found);

        const updatedResult =  await this.postsCommandRepository.updatePost(postId, title, shortDescription, content, blogId, blogResult.payload!.name);

        if(updatedResult.success) {
            return new ResultDTO(InternalCode.No_Content, updatedResult.payload);
        } else {
            return new ResultDTO(InternalCode.Server_Error);
        }
    }

    async deletePostById(postId: string): Promise<ResultDTO<{ isDeleted: boolean }>> {
        const deletedResult = await this.postsCommandRepository.deletePostById(postId);

        if(deletedResult.success) {
            return new ResultDTO(InternalCode.No_Content, deletedResult.payload);
        } else {
            return new ResultDTO(deletedResult.code);
        }
    }
}