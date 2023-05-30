import {ViewCommentModel} from "../../models/comment/ViewCommentModel";
import {WithId} from "mongodb";
import {ViewWithQueryCommentModel} from "../../models/comment/ViewWithQueryCommentModel";
import {QueryParamsCommentModel} from "../../models/comment/QueryParamsCommentModel";
import {CommentsDB, CommentsModelClass} from "../../db";
import {Query} from "mongoose";

export class CommentsQueryRepository {
    async findComments(postId: string, query: QueryParamsCommentModel): Promise<ViewWithQueryCommentModel> {
        const commentsInstances = CommentsModelClass.find({postId});
        const queryResult = await this._queryBuilder(query, commentsInstances);

        const comments = await commentsInstances;

        queryResult.items = comments.map(comment => this._mapCommentDBByViewCommentModel(comment));
        return queryResult;
    }
    async findCommentById(commentId: string) {
        const comment = await CommentsModelClass.findById(commentId).lean();

        if (comment) {
            return this._mapCommentDBByViewCommentModel(comment);
        } else {
            return null;
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
    async _queryBuilder(queryCommentsData: QueryParamsCommentModel, query: Query<any, any>): Promise<ViewWithQueryCommentModel> {
        const sortBy = queryCommentsData.sortBy ? queryCommentsData.sortBy : "createdAt";
        const sortDirection = queryCommentsData.sortDirection ? queryCommentsData.sortDirection : "desc";
        const pageNumber = queryCommentsData.pageNumber ? +queryCommentsData.pageNumber : 1;
        const pageSize = queryCommentsData.pageSize ? +queryCommentsData.pageSize : 10;

        const skip = pageSize * (pageNumber - 1);

        const totalCount = await query.clone().count();

        query.sort({[sortBy]: sortDirection}).skip(skip).limit(pageSize);
        const pagesCount = Math.ceil(totalCount / pageSize);

        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: []
        }
    }
}