import { Request, Response } from "express";

export type BlogType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
};

export type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
}

export type ErrorType = {
    message: string | any,
    field: string
}

export type RequestWithParams<T> = Request<T>;
export type RequestWithParamsAndBody<T, C> = Request<T,{}, C>;
export type RequestWithBody<T> = Request<{}, {}, T>;
export type RequestEmpty = Request<{}, {}, {}, {}>;
export type ResponseEmpty = Response<{}, {}>;