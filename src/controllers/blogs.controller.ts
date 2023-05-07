import {Request, Response} from "express";
import {
    RequestEmpty,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    ResponseEmpty
} from "../shared/types";
import {ViewBlogModel} from "../models/blog/ViewBlogModel";
import {CreateBlogModel} from "../models/blog/CreateBlogModel";
import {URIParamsBlogModel} from "../models/blog/URIParamsBlogModel";
import {UpdateBlogModel} from "../models/blog/UpdateBlogModel";
import {blogsServices} from "../domain/blogs-services";

export const getAllBlogs = async (req: RequestEmpty, res: Response<ViewBlogModel[]>) => {
    const blogs = await blogsServices.findBlogs();
    res.status(200).json(blogs);
}

export const createBlog = async (req: RequestWithBody<CreateBlogModel>, res: Response<ViewBlogModel>) => {
    const newBlog = await blogsServices.createBlog(req.body.name, req.body.description, req.body.websiteUrl);
    res.status(201).json(newBlog);
}

export const getBlog = async (req: RequestWithParams<URIParamsBlogModel>, res: Response<ViewBlogModel>) => {
    const blog = await blogsServices.findBlogById(req.params.blogId);

    if (blog) {
        res.status(200).json(blog)
    } else {
        res.sendStatus(404);
    }
}

export const deleteBlog = async (req: Request<URIParamsBlogModel>, res: ResponseEmpty) => {
    const isDeleted = await blogsServices.deleteBlogById(req.params.blogId);

    if (isDeleted) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
}

export const updateBlog = async (req: RequestWithParamsAndBody<URIParamsBlogModel, UpdateBlogModel>, res: ResponseEmpty) => {
    const isUpdated = await blogsServices.updateBlog(req.params.blogId, req.body.name, req.body.description, req.body.websiteUrl);

    if (isUpdated) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
}