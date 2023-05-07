import { Request, Response } from "express";

export type ErrorType = {
    message: string | any,
    field: string
}

export type RequestWithParams<T> = Request<T>;
export type RequestWithQueryParams<T> = Request<{}, {}, {}, T>;
export type RequestWithQueryParamsAndURI<T, C> = Request<T, {}, {}, C>;
export type RequestWithParamsAndBody<T, C> = Request<T,{}, C>;
export type RequestWithBody<T> = Request<{}, {}, T>;
export type RequestEmpty = Request<{}, {}, {}, {}>;
export type ResponseEmpty = Response<{}, {}>;