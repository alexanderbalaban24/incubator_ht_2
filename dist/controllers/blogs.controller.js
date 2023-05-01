"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlog = exports.deleteBlog = exports.getBlog = exports.createBlog = exports.getAllBlogs = void 0;
const blogs_repository_1 = require("../repositories/blogs-repository");
const getAllBlogs = (req, res) => {
    const blogs = blogs_repository_1.blogsRepository.findBlogs().map((el) => {
        return {
            id: el.id,
            name: el.name,
            description: el.description,
            websiteUrl: el.websiteUrl
        };
    });
    res.status(200).json(blogs);
};
exports.getAllBlogs = getAllBlogs;
const createBlog = (req, res) => {
    const newBlog = blogs_repository_1.blogsRepository.createBlog(req.body.name, req.body.description, req.body.websiteUrl);
    res.status(201).json(newBlog);
};
exports.createBlog = createBlog;
const getBlog = (req, res) => {
    const blog = blogs_repository_1.blogsRepository.findBlogById(req.params.blogId);
    if (blog) {
        res.status(200).json(blog);
    }
    else {
        res.status(404).json({ message: "blog not found" });
    }
};
exports.getBlog = getBlog;
const deleteBlog = (req, res) => {
    const isDeleted = blogs_repository_1.blogsRepository.deleteBlogById(req.params.blogId);
    if (isDeleted) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
};
exports.deleteBlog = deleteBlog;
const updateBlog = (req, res) => {
    const isUpdated = blogs_repository_1.blogsRepository.updateBlog(req.params.blogId, req.body.name, req.body.description, req.body.websiteUrl);
    if (isUpdated) {
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
};
exports.updateBlog = updateBlog;
