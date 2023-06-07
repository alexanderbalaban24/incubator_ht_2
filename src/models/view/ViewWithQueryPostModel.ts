import {ViewPostModel} from "./ViewPostModel";

export type ViewWithQueryPostModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: ViewPostModel[]
}