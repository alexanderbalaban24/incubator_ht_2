import { Request, Response } from "express";
import {HydratedDocument, QueryWithHelpers, Schema} from "mongoose";
import {QueryBuildDTO} from "./dto";

export type ErrorType = {
    message: string | any,
    field: string
}

export type QueryDataType = {
    sortBy?: string,
    sortDirection?: string,
    pageNumber?: string,
    pageSize?: string,
    searchLoginTerm?: string,
    searchEmailTerm?: string,
    searchNameTerm?: string
}

export type RequestWithParams<T> = Request<T>;
export type RequestWithQueryParams<T> = Request<{}, {}, {}, T>;
export type RequestWithQueryParamsAndURI<T, C> = Request<T, {}, {}, C>;
export type RequestWithParamsAndBody<T, C> = Request<T,{}, C>;
export type RequestWithBody<T> = Request<{}, {}, T>;
export type RequestEmpty = Request<{}, {}, {}, {}>;
export type ResponseEmpty = Response<{}, {}>;

export type QueryCustomMethods = {
    findWithQuery<T, C>(queryData: QueryDataType, id?:string): Promise<QueryBuildDTO<T, C>>
}