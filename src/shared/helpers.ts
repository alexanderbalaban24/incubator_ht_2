import {QueryDataType} from "./types";
import {QueryBuildDTO, ResultDTO} from "./dto";
import {Response} from "express";
import {HTTPResponseStatusCodes, InternalCode, LikeStatusEnum, ReverseLike} from "./enums";
import {injectable} from "inversify";
import {likeSchema} from "../schemes/like-schema";
import {UserLikeType} from "../models/database/PostsModelClass";

export const queryHelper = {
    async findWithQuery<T, C>(queryData: QueryDataType, id?: string) {
        const sortBy = queryData.sortBy ? queryData.sortBy : "createdAt";
        const sortDirection = queryData.sortDirection ? queryData.sortDirection : "desc"
        const pageNumber = queryData.pageNumber ? +queryData.pageNumber : 1;
        const pageSize = queryData.pageSize ? +queryData.pageSize : 10;

        const skip = pageSize * (pageNumber - 1);

        if (queryData.searchLoginTerm) {
            this.regex("login", new RegExp(queryData.searchLoginTerm));
        }
        if (queryData.searchEmailTerm) {
            this.regex("email", new RegExp(queryData.searchEmailTerm))
        }

        if (queryData.searchNameTerm) {
            this.regex("name", new RegExp(queryData.searchNameTerm));
        }

        if (id !== undefined) {
            this.where("blogId").equals(id);
        }

        const totalCount = await this.clone().count();

        this.sort({[sortBy]: sortDirection}).skip(skip).limit(pageSize);
        const pagesCount = Math.ceil(totalCount / pageSize);

        const items = await this;
        return new QueryBuildDTO<T, C>(pagesCount, pageNumber, pageSize, totalCount, items)
    }
}

@injectable()
export class ResponseHelper {

    mapStatusCode(internalCode: InternalCode) {
        const code = HTTPResponseStatusCodes[internalCode];
        if (!code) return HTTPResponseStatusCodes.INTERNAL_SERVER_ERROR;

        return code;
    }
    sendResponse<T>(res: Response<T>, resultMain: ResultDTO<T>) {
        const code = this.mapStatusCode(resultMain.code);

        if (code === HTTPResponseStatusCodes.NO_CONTENT) return res.sendStatus(code);


        if (resultMain.success) {
            res.status(code).json(resultMain.payload!);
        } else {
            res.sendStatus(code);
        }

    }
}

export const reverseLikeStatus = (likeStatus: LikeStatusEnum): LikeStatusEnum => {
    return ReverseLike[likeStatus] as unknown as LikeStatusEnum;
}
