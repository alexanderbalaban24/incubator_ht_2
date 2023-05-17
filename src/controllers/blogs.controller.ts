import {Request, Response} from "express";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody, RequestWithQueryParams, RequestWithQueryParamsAndURI,
    ResponseEmpty
} from "../shared/types";
import {ViewBlogModel} from "../models/blog/ViewBlogModel";
import {CreateBlogModel} from "../models/blog/CreateBlogModel";
import {URIParamsBlogModel} from "../models/blog/URIParamsBlogModel";
import {UpdateBlogModel} from "../models/blog/UpdateBlogModel";
import {blogsServices} from "../domain/blogs-services";
import {blogsQueryRepository} from "../repositories/blogs/blogs-query-repository";
import {CreatePostModel} from "../models/post/CreatePostModel";
import {ViewPostModel} from "../models/post/ViewPostModel";
import {postsServices} from "../domain/posts-services";
import {postsQueryRepository} from "../repositories/posts/posts-query-repository";
import {QueryParamsBlogModel} from "../models/blog/QueryParamsBlogModel";
import {ViewWithQueryBlogModel} from "../models/blog/ViewWithQueryBlogModel";
import {QueryParamsPostModel} from "../models/post/QueryParamsPostModel";
import {ViewWithQueryPostModel} from "../models/post/ViewWithQueryPostModel";

export const getAllBlogs = async (req: RequestWithQueryParams<QueryParamsBlogModel>, res: Response<ViewWithQueryBlogModel>) => {
    const blogs = await blogsQueryRepository.findBlogs(req.query);
    res.status(200).json(blogs);
}

export const createBlog = async (req: RequestWithBody<CreateBlogModel>, res: Response<ViewBlogModel>) => {
    const blogId = await blogsServices.createBlog(req.body.name, req.body.description, req.body.websiteUrl);
    const blog = await blogsQueryRepository.findBlogById(blogId);
    res.status(201).json(blog!);
}

export const getBlog = async (req: RequestWithParams<URIParamsBlogModel>, res: Response<ViewBlogModel>) => {
    const blog = await blogsQueryRepository.findBlogById(req.params.blogId);

    if (blog) {
        res.status(200).json(blog);
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

export const createPostByBlogId = async (req: RequestWithParamsAndBody<{
    blogId: string
}, CreatePostModel>, res: Response<ViewPostModel>) => {
    const blogId = req.params.blogId;
    const postId = await postsServices.createPost(req.body.title, req.body.shortDescription, req.body.content, blogId);
    if (postId) {
        const post = await postsQueryRepository.findPostById(postId);
        res.status(201).json(post!);
    } else {
        res.sendStatus(404);
    }
}

export const getPostsByBlogId = async (req: RequestWithQueryParamsAndURI<{
    blogId: string
}, QueryParamsPostModel>, res: Response<ViewWithQueryPostModel>) => {
    const posts = await postsQueryRepository.findPost(req.query, req.params.blogId);

    res.status(200).json(posts);
}