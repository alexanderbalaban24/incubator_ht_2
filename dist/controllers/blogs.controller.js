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
exports.getPostsByBlogId = exports.createPostByBlogId = exports.updateBlog = exports.deleteBlog = exports.getBlog = exports.createBlog = exports.getAllBlogs = void 0;
const blogs_services_1 = require("../domain/blogs-services");
const blogs_query_repository_1 = require("../repositories/blogs-query-repository");
const posts_services_1 = require("../domain/posts-services");
const posts_query_repository_1 = require("../repositories/posts-query-repository");
const getAllBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield blogs_query_repository_1.blogsQueryRepository.findBlogs(req.query);
    res.status(200).json(blogs);
});
exports.getAllBlogs = getAllBlogs;
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = yield blogs_services_1.blogsServices.createBlog(req.body.name, req.body.description, req.body.websiteUrl);
    const blog = yield blogs_query_repository_1.blogsQueryRepository.findBlogById(blogId);
    res.status(201).json(blog);
});
exports.createBlog = createBlog;
const getBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_query_repository_1.blogsQueryRepository.findBlogById(req.params.blogId);
    if (blog) {
        res.status(200).json(blog);
    }
    else {
        res.sendStatus(404);
    }
});
exports.getBlog = getBlog;
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isDeleted = yield blogs_services_1.blogsServices.deleteBlogById(req.params.blogId);
    if (isDeleted) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
exports.deleteBlog = deleteBlog;
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isUpdated = yield blogs_services_1.blogsServices.updateBlog(req.params.blogId, req.body.name, req.body.description, req.body.websiteUrl);
    if (isUpdated) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
exports.updateBlog = updateBlog;
const createPostByBlogId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.blogId;
    const postId = yield posts_services_1.postsServices.createPost(req.body.title, req.body.shortDescription, req.body.content, blogId);
    if (postId) {
        const post = yield posts_query_repository_1.postsQueryRepository.findPostById(postId);
        res.status(201).json(post);
    }
    else {
        res.sendStatus(404);
    }
});
exports.createPostByBlogId = createPostByBlogId;
const getPostsByBlogId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield posts_query_repository_1.postsQueryRepository.findPost(req.query, req.params.blogId);
    res.status(200).json(posts);
});
exports.getPostsByBlogId = getPostsByBlogId;
