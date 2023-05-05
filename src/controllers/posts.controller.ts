import {
    RequestEmpty,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    ResponseEmpty
} from "../shared/types";
import {Response} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {ViewPostModel} from "../models/post/ViewPostModel";
import {CreatePostModel} from "../models/post/CreatePostModel";


export const getAllPosts = async (req: RequestEmpty, res: Response<ViewPostModel[]>) => {
    const posts = await postsRepository.findPost();
    res.status(200).json(posts);
}

export const createPost = async (req: RequestWithBody<CreatePostModel>, res: Response<ViewPostModel>) => {
    const newPost = await postsRepository.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    if (newPost) {
        res.status(201).json(newPost);
    } else {
        res.sendStatus(404);
    }
}

export const getPost = async (req: RequestWithParams<{postId: string}>, res: Response<ViewPostModel>) => {
    const post = await postsRepository.findPostById(req.params.postId);

    if (post) {
        res.status(200).json(post);
    } else {
        res.sendStatus(404);
    }
}

export const updatePost = async (req: RequestWithParamsAndBody<{postId: string}, CreatePostModel>, res: ResponseEmpty) => {
    const isUpdated = await postsRepository.updatePost(req.params.postId, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);

    if (isUpdated) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
}

export const deletePost = async (req: RequestWithParams<{postId: string}>, res: ResponseEmpty) => {
    const isDeleted = await postsRepository.deletePostById(req.params.postId);

    if (isDeleted) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
}