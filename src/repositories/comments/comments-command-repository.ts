import {CommentsDB, CommentsModelClass} from "../../models/database/CommentsModelClass";
import {CommentDTO} from "../../domain/dtos";
import {ResultDTO} from "../../shared/dto";
import {InternalCode} from "../../shared/enums";
import {HydratedDocument} from "mongoose";
import {injectable} from "inversify";
import {IWithMethod} from "../../shared/interfaces";

@injectable()
export class CommentsCommandRepository {

    async findCommentById(commentId: string): Promise<ResultDTO<HydratedDocument<CommentsDB, IWithMethod<CommentsDB>>>> {
        const commentInstance = await CommentsModelClass.findById(commentId);
        if(!commentInstance) return new ResultDTO(InternalCode.Not_Found);

        return new ResultDTO(InternalCode.Success, commentInstance);
    }
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

    async save(like: HydratedDocument<CommentsDB>): Promise<ResultDTO<{success: true}>> {
        await like.save();

        return new ResultDTO(InternalCode.Success, {success: true});
    }
}
