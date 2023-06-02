import {CommentsModelClass} from "../../models/comment/CommentsModelClass";
import {CommentDTO} from "../../domain/dtos";
import {ResultDTO} from "../../shared/dto";
import {InternalCode} from "../../shared/enums";

export class CommentsCommandRepository {
    async createComment(newComment: CommentDTO): Promise<ResultDTO<{ id: string }>> {
        const result = await new CommentsModelClass(newComment).save();

        return new ResultDTO(InternalCode.Success, {id: result._id.toString()});
    }

    async deleteComment(commentId: string): Promise<ResultDTO<{ isDeleted: boolean }>> {
        const commentInstances = await CommentsModelClass.findById(commentId);
        if (!commentInstances) return new ResultDTO(InternalCode.Not_Found);

        const result = await commentInstances.deleteOne();
        const isDeleted = result.$isDeleted();

        if (!isDeleted) return new ResultDTO(InternalCode.Server_Error);

        return new ResultDTO(InternalCode.Success, {isDeleted})
    }

    async updateComment(commentId: string, content: string): Promise<ResultDTO<{ isUpdate: boolean }>> {
        const commentInstances = await CommentsModelClass.findById(commentId);
        if (!commentInstances) return new ResultDTO(InternalCode.Not_Found);

        commentInstances.content = content;

        await commentInstances.save();
        return new ResultDTO(InternalCode.Success, {isUpdate: true});
    }
}
