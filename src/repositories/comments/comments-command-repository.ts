import {Comment} from "../../domain/comments-services";
import {ObjectId} from "mongodb";
import {CommentsModel} from "../../db";

export const commentsCommandRepository = {
    async createComment(newComment: Comment): Promise<string> {
    const result = await new CommentsModel(newComment).save();

    return result._id.toString();
    },
    async deleteComment(commentId: string): Promise<boolean> {
        const result = await CommentsModel.deleteOne({_id: new ObjectId(commentId)});

        return result.deletedCount === 1;
    },
    async updateComment(commentId: string, content: string): Promise<boolean> {
        const result = await CommentsModel.updateOne({_id: new ObjectId(commentId)}, {$set: {content: content}});

        return result.matchedCount === 1;
    }
}
