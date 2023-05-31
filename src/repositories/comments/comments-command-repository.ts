import {CommentsModelClass} from "../../models/comment/CommentsModelClass";
import {CommentDTO} from "../../domain/dtos";

export class CommentsCommandRepository {
    async createComment(newComment: CommentDTO): Promise<string> {
    const result = await new CommentsModelClass(newComment).save();

    return result._id.toString();
    }
    async deleteComment(commentId: string): Promise<boolean> {
        const commentInstances = await CommentsModelClass.findById(commentId);
        if (!commentInstances) return false;

        const result = await commentInstances.deleteOne();

        return result.$isDeleted();
    }
    async updateComment(commentId: string, content: string): Promise<boolean> {
        const commentInstances = await CommentsModelClass.findById(commentId);
        if(!commentInstances) return false;

        commentInstances.content = content;

        try {
            await commentInstances.save();
            return true;
        } catch(e) {
            return false;
        }
    }
}
