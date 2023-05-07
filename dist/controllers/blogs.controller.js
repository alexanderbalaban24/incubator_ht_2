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
exports.updateBlog = exports.deleteBlog = exports.getBlog = exports.createBlog = exports.getAllBlogs = void 0;
const blogs_services_1 = require("../domain/blogs-services");
const blogs_query_repository_1 = require("../repositories/blogs-query-repository");
const getAllBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield blogs_query_repository_1.blogsQueryRepository.findBlogs();
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
