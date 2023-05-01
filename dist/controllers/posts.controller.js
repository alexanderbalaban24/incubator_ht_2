"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.getPost = exports.createPost = exports.getAllPosts = void 0;
const posts_repository_1 = require("../repositories/posts-repository");
const getAllPosts = (req, res) => {
    const posts = posts_repository_1.postsRepository.findPost().map((el) => {
        return {
            id: el.id,
            title: el.title,
            shortDescription: el.shortDescription,
            content: el.content,
            blogId: el.blogId,
            blogName: el.blogName
        };
    });
    res.status(200).json(posts);
};
exports.getAllPosts = getAllPosts;
const createPost = (req, res) => {
    const newPost = posts_repository_1.postsRepository.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    if (newPost) {
        res.status(201).json(newPost);
    }
    else {
        res.sendStatus(404);
    }
};
exports.createPost = createPost;
const getPost = (req, res) => {
    const post = posts_repository_1.postsRepository.findPostById(req.params.postId);
    if (post) {
        res.status(200).json(post);
    }
    else {
        res.sendStatus(404);
    }
};
exports.getPost = getPost;
const updatePost = (req, res) => {
    const isUpdated = posts_repository_1.postsRepository.updatePost(req.params.postId, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    if (isUpdated) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
};
exports.updatePost = updatePost;
const deletePost = (req, res) => {
    const isDeleted = posts_repository_1.postsRepository.deletePostById(req.params.postId);
    if (isDeleted) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
};
exports.deletePost = deletePost;
