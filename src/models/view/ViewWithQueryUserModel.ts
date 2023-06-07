import {ViewUserModel} from "./ViewUserModel";

export type ViewWithQueryUserModel = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items:ViewUserModel[]
}