import {Request, Response} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
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
import {ViewPostModel} from "../models/post/ViewPostModel";

export const getAllBlogs = (req: RequestEmpty, res: Response<ViewBlogModel[]>) => {
    const blogs = blogsRepository.findBlogs().map((el): ViewBlogModel => {
        return {
            id: el.id,
            name: el.name,
            description: el.description,
            websiteUrl: el.websiteUrl
        }
    });
    res.status(200).json(blogs);
}

export const createBlog = (req: RequestWithBody<CreateBlogModel>, res: Response<ViewBlogModel>) => {
    const newBlog = blogsRepository.createBlog(req.body.name, req.body.description, req.body.websiteUrl);
    res.status(201).json(newBlog);
}

export const getBlog = (req: RequestWithParams<URIParamsBlogModel>, res: Response<ViewBlogModel | any>) => {
    const blog = blogsRepository.findBlogById(req.params.blogId);

    if (blog) {
        res.status(200).json(blog)
    } else {
        res.status(404).json({message: "blog not found"})
    }
}

export const deleteBlog = (req: Request<URIParamsBlogModel>, res: ResponseEmpty) => {
    const isDeleted = blogsRepository.deleteBlogById(req.params.blogId);

    if (isDeleted) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
}

export const updateBlog = (req: RequestWithParamsAndBody<URIParamsBlogModel, UpdateBlogModel>, res: ResponseEmpty) => {
    const isUpdated = blogsRepository.updateBlog(req.params.blogId, req.body.name, req.body.description, req.body.websiteUrl);

    if (isUpdated) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
}