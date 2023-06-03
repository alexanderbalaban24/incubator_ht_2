import {QueryDataType} from "./types";
import {QueryBuildDTO, ResultDTO} from "./dto";
import {mapStatusCode} from "./utils";
import {Response} from "express";
import {HTTPResponseStatusCodes} from "./enums";

export const queryHelper = {
    async customFind<T, C>(queryData: QueryDataType, id?: string) {
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

export const sendResponse = <T>(res: Response<T>, resultMain: ResultDTO<T>) => {
    const code = mapStatusCode(resultMain.code);

    if (code === HTTPResponseStatusCodes.NO_CONTENT) return res.sendStatus(code);


    if (resultMain.success) {
        res.status(code).json(resultMain.payload!);
    } else {
        res.sendStatus(code);
    }

}