"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.getPost = exports.createPost = exports.getAllPosts = void 0;
const posts_services_1 = require("../domain/posts-services");
const posts_query_repository_1 = require("../repositories/posts-query-repository");
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield posts_query_repository_1.postsQueryRepository.findPost(req.query);
    res.status(200).json(posts);
});
exports.getAllPosts = getAllPosts;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = yield posts_services_1.postsServices.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    if (postId) {
        const post = yield posts_query_repository_1.postsQueryRepository.findPostById(postId);
        res.status(201).json(post);
    }
    else {
        res.sendStatus(404);
    }
});
exports.createPost = createPost;
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield posts_query_repository_1.postsQueryRepository.findPostById(req.params.postId);
    if (post) {
        res.status(200).json(post);
    }
    else {
        res.sendStatus(404);
    }
});
exports.getPost = getPost;
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isUpdated = yield posts_services_1.postsServices.updatePost(req.params.postId, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    if (isUpdated) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
exports.updatePost = updatePost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield posts_services_1.postsServices.deletePostById(req.params.postId);
    if (isDeleted) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
exports.deletePost = deletePost;
