import {Comment} from "../../domain/comments-services";
import {commentsCollections} from "../../db/collections/commentsCollections";
import {ObjectId} from "mongodb";

export const commentsCommandRepository = {
    async createComment(newComment: Comment): Promise<string> {
    const result = await commentsCollections.insertOne(newComment);

    return result.insertedId.toString();
    },
    async deleteComment(commentId: string): Promise<boolean> {
        const result = await commentsCollections.deleteOne({_id: new ObjectId(commentId)});

        return result.deletedCount === 1;
    },
    async updateComment(commentId: string, content: string): Promise<boolean> {
        const result = await commentsCollections.updateOne({_id: new ObjectId(commentId)}, {$set: {content: content}});

        return result.matchedCount === 1;
    }
}
