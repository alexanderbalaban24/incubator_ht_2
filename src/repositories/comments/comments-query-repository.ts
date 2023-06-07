import {ViewCommentModel} from "../../models/view/ViewCommentModel";
import {WithId} from "mongodb";
import {ViewWithQueryCommentModel} from "../../models/view/ViewWithQueryCommentModel";
import {QueryParamsCommentModel} from "../../models/input/QueryParamsCommentModel";
import {CommentsDB, CommentsModelClass, LikeStatusEnum} from "../../models/database/CommentsModelClass";
import {ResultDTO} from "../../shared/dto";
import {InternalCode} from "../../shared/enums";

export class CommentsQueryRepository {
    async findComments(postId: string, query: QueryParamsCommentModel, userId?: string): Promise<ResultDTO<ViewWithQueryCommentModel>> {
const test =  await CommentsModelClass.find().lean();
        const commentsData = await CommentsModelClass.find({postId}).customFind<WithId<CommentsDB>, ViewCommentModel>(query);
        commentsData.map((comment) => this._mapCommentDBByViewCommentModel(comment, userId));

        return new ResultDTO(InternalCode.Success, commentsData as ViewWithQueryCommentModel);
    }
    async findCommentById(commentId: string, userId?: string): Promise<ResultDTO<ViewCommentModel>> {
        const comment = await CommentsModelClass.findById(commentId).lean();
        if (comment) {
            const mappedData = this._mapCommentDBByViewCommentModel(comment, userId);
            return new ResultDTO(InternalCode.Success, mappedData);
        } else {
            return new ResultDTO(InternalCode.Not_Found);
        }
    }
    _mapCommentDBByViewCommentModel(comment: WithId<CommentsDB>, userId?: string): ViewCommentModel {
        const userLikeData = comment.usersLikes.find(item => item.userId === userId);
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: comment.likesCount,
                dislikesCount: comment.dislikesCount,
                myStatus: userLikeData?.likeStatus ? userLikeData.likeStatus : LikeStatusEnum.None
            }
        }
    }
}