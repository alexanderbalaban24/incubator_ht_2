import {PostsModelClass} from "../../models/database/PostsModelClass";
import {PostDTO} from "../../domain/dtos";
import {ResultDTO} from "../../shared/dto";
import {InternalCode} from "../../shared/enums";

export class PostsCommandRepository {
    async createPost(newPost: PostDTO): Promise<ResultDTO<{ id: string }>> {
        const result = await new PostsModelClass(newPost).save();
        return new ResultDTO(InternalCode.Success, {id: result._id.toString()});
    }

    async updatePost(postId: string, title: string, shortDescription: string, content: string, blogId: string, blogName: string): Promise<ResultDTO<{ isUpdate: boolean }>> {
        const postInstances = await PostsModelClass.findById(postId);
        if (!postInstances) return new ResultDTO(InternalCode.Not_Found);

        postInstances.title = title;
        postInstances.shortDescription = shortDescription;
        postInstances.content = content;
        postInstances.blogId = blogId;
        postInstances.blogName = blogName;

        await postInstances.save();

        return new ResultDTO(InternalCode.Success, {isUpdate: true});
    }

    async deletePostById(postId: string): Promise<ResultDTO<{ isDeleted: boolean }>> {
        const postInstances = await PostsModelClass.findById(postId);
        if (!postInstances) return new ResultDTO(InternalCode.Not_Found);


            const result = await postInstances.deleteOne();
            const isDeleted = result.$isDeleted();

            if (!isDeleted) return new ResultDTO(InternalCode.Server_Error);

            return new ResultDTO(InternalCode.Success, {isDeleted});
    }
}