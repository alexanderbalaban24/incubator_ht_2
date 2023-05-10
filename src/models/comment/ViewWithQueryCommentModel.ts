import {ViewCommentModel} from "./ViewCommentModel";

export type ViewWithQueryCommentModel = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: ViewCommentModel[]
}