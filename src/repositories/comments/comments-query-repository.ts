import {ViewCommentModel} from "../../models/comment/ViewCommentModel";
import {WithId} from "mongodb";
import {ViewWithQueryCommentModel} from "../../models/comment/ViewWithQueryCommentModel";
import {QueryParamsCommentModel} from "../../models/comment/QueryParamsCommentModel";
import {CommentsDB, CommentsModelClass} from "../../models/comment/CommentsModelClass";
import {ResultDTO} from "../../shared/dto";
import {InternalCode} from "../../shared/enums";

export class CommentsQueryRepository {
    async findComments(postId: string, query: QueryParamsCommentModel): Promise<ResultDTO<ViewWithQueryCommentModel>> {
        const commentsData = await CommentsModelClass.find({postId}).customFind<WithId<CommentsDB>, ViewCommentModel>(query);
        commentsData.map(this._mapCommentDBByViewCommentModel);

        return new ResultDTO(InternalCode.Success, commentsData as ViewWithQueryCommentModel);
    }
    async findCommentById(commentId: string): Promise<ResultDTO<ViewCommentModel>> {
        const comment = await CommentsModelClass.findById(commentId).lean();

        if (comment) {
            const mappedData = this._mapCommentDBByViewCommentModel(comment);
            return new ResultDTO(InternalCode.Success, mappedData);
        } else {
            return new ResultDTO(InternalCode.Not_Found);
        }
    }
    _mapCommentDBByViewCommentModel(comment: WithId<CommentsDB>): ViewCommentModel {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt
        }
    }
}