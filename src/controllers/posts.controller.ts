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


export const getAllPosts = (req: RequestEmpty, res: Response<ViewPostModel[]>) => {
    const posts = postsRepository.findPost().map((el): ViewPostModel => {
        return {
            id: el.id,
            title: el.title,
            shortDescription: el.shortDescription,
            content: el.content,
            blogId: el.blogId,
            blogName: el.blogName
        }
    });
    res.status(200).json(posts);
}

export const createPost = (req: RequestWithBody<CreatePostModel>, res: Response<ViewPostModel>) => {
    const newPost = postsRepository.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    if (newPost) {
        res.status(201).json(newPost);
    } else {
        res.sendStatus(404);
    }
}

export const getPost = (req: RequestWithParams<{postId: string}>, res: Response<ViewPostModel>) => {
    const post = postsRepository.findPostById(req.params.postId);

    if (post) {
        res.status(200).json(post);
    } else {
        res.sendStatus(404);
    }
}

export const updatePost = (req: RequestWithParamsAndBody<{postId: string}, CreatePostModel>, res: ResponseEmpty) => {
    const isUpdated = postsRepository.updatePost(req.params.postId, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);

    if (isUpdated) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
}

export const deletePost = (req: RequestWithParams<{postId: string}>, res: ResponseEmpty) => {
    const isDeleted = postsRepository.deletePostById(req.params.postId);

    if (isDeleted) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
}