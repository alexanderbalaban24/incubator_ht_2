import {HTTPResponseStatusCodes, InternalCode} from "./enums";
import {QueryDataType} from "./types";
import {QueryBuildDTO} from "./dto";

export const mapStatusCode = (internalCode: InternalCode) => {
    const code = HTTPResponseStatusCodes[internalCode];
    if (!code) return HTTPResponseStatusCodes.INTERNAL_SERVER_ERROR;

    return code;
}

export const VALID_BLOG_DATA = {
    name: "test auth",
    description: "string descriptin",
    websiteUrl: "https://tdfddddt.qq"
}

export const VALID_POST_DATA = {
    title: "test title",
    shortDescription: "test post shortDescription",
    content: "test post content"
}

export const INVALID_VALUE = "";

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

        if(id !== undefined) {
            this.where("blogId").equals(id);
        }

        const totalCount = await this.clone().count();

        this.sort({[sortBy]: sortDirection}).skip(skip).limit(pageSize);
        const pagesCount = Math.ceil(totalCount / pageSize);

        const items = await this;

        return new QueryBuildDTO<T, C>(pagesCount, pageNumber, pageSize, totalCount, items)
    }
}