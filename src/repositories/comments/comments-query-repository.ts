import {commentsCollections, CommentsDB} from "../../db/collections/commentsCollections";
import {ViewCommentModel} from "../../models/comment/ViewCommentModel";
import {FindCursor, ObjectId} from "mongodb";
import {ViewWithQueryCommentModel} from "../../models/comment/ViewWithQueryCommentModel";
import {QueryParamsCommentModel} from "../../models/comment/QueryParamsCommentModel";

export const commentsQueryRepository = {
    async findComments(postId: string, query: QueryParamsCommentModel): Promise<ViewWithQueryCommentModel> {
        const cursor = commentsCollections.find({postId});
        const queryResult = await this._findConstructor(query, cursor);

        const comments = await cursor.toArray();

        queryResult.items = comments.map(comment => this._mapCommentDBByViewCommentModel(comment));
        return queryResult;
    },
    async findCommentById(commentId: string) {
        const comment = await commentsCollections.findOne({_id: new ObjectId(commentId)});
        if (comment) {
            return this._mapCommentDBByViewCommentModel(comment);
        } else {
            return null;
        }
    },
    _mapCommentDBByViewCommentModel(comment: CommentsDB): ViewCommentModel {
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt
        }
    },
    async _findConstructor(query: QueryParamsCommentModel, cursor: FindCursor): Promise<ViewWithQueryCommentModel> {
        const sortBy = query.sortBy ? query.sortBy : "createdAt";
        const sortDirection = query.sortDirection ? query.sortDirection : "desc";
        const pageNumber = query.pageNumber ? +query.pageNumber : 1;
        const pageSize = query.pageSize ? +query.pageSize : 10;

        const skip = pageSize * (pageNumber - 1);

        const totalCount = await cursor.count();

        cursor.sort({[sortBy]: sortDirection}).skip(skip).limit(pageSize);
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