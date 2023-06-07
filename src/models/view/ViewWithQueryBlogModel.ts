import {ViewBlogModel} from "./ViewBlogModel";

export type ViewWithQueryBlogModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: ViewBlogModel[]
}

