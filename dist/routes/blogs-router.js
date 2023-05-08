"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const blogs_controller_1 = require("../controllers/blogs.controller");
const input_validation_1 = require("../middlewares/input-validation");
const blogs_schema_1 = require("../schemes/blogs-schema");
const basic_auth_1 = require("../middlewares/basic-auth");
const posts_schema_1 = require("../schemes/posts-schema");
const uriParams_validation_1 = require("../middlewares/uriParams-validation");
exports.blogsRouter = (0, express_1.Router)();
exports.blogsRouter.route('/')
    .get(blogs_controller_1.getAllBlogs)
    .post(basic_auth_1.basicAuthMiddleware, blogs_schema_1.blogValidateSchema, input_validation_1.inputValidationMiddleware, blogs_controller_1.createBlog);
exports.blogsRouter.route('/:blogId')
    .get(blogs_controller_1.getBlog)
    .put(basic_auth_1.basicAuthMiddleware, blogs_schema_1.blogValidateSchema, input_validation_1.inputValidationMiddleware, blogs_controller_1.updateBlog)
    .delete(basic_auth_1.basicAuthMiddleware, blogs_controller_1.deleteBlog);
exports.blogsRouter.route('/:blogId/posts')
    .get(uriParams_validation_1.uriParamsValidation, blogs_controller_1.getPostsByBlogId)
    .post(basic_auth_1.basicAuthMiddleware, uriParams_validation_1.uriParamsValidation, posts_schema_1.postValidateSchema, input_validation_1.inputValidationMiddleware, blogs_controller_1.createPostByBlogId);
